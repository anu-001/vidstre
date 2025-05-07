/* eslint-disable no-loops/no-loops */
import { AttributeValue, DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	PutCommandInput,
	QueryCommand,
	ScanCommand,
	QueryCommandInput,
	ScanCommandInput,
	UpdateCommand,
	UpdateCommandInput,
	DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(ddbClient);

type Item = Record<string, AttributeValue>;

const isTest = process.env.JEST_WORKER_ID;
const isServerlessOffline = process.env.IS_OFFLINE;

const config = {
	convertEmptyValues: false,
	removeUndefinedValues: true,
	region: process.env.region || 'eu-west-1',
	...(isTest && {
		endpoint: 'http://localhost:9990',
		sslEnabled: false,
		region: 'localhost'
	}),
	...(isServerlessOffline && {
		endpoint: 'http://localhost:9990'
	})
};

const Dynamo = {
	get: async <T = Item>({
		pkKey = 'id',
		pkValue,
		skKey,
		skValue,
		tableName
	}: {
		pkKey?: string;
		pkValue: string;
		skKey?: string;
		skValue?: string;
		tableName: string;
	}) => {
		const params = {
			TableName: tableName,
			Key: {
				[pkKey]: pkValue
			}
		};
		if (skKey && skValue) {
			params.Key[skKey] = skValue;
		}

		const res = await ddbClient.send(new GetCommand(params));
		return res.Item as T;
	},
	getUser: async <T = Item>({ tableName, value }: { tableName: string; value: string }) => {
		const params = {
			TableName: tableName,
			indexName: 'usernameIndex',
			key: 'username',
			value
		};
		const res = await ddbClient.send(new GetCommand(params));
		return res.Item as T;
	},
	write: async <T = Item>({
		data,
		tableName
	}: {
		data: { [key: string]: any };
		tableName: string;
	}) => {
		const params: PutCommandInput = {
			TableName: tableName,
			Item: { ...data }
		};
		await ddbClient.send(new PutCommand(params));
		return params.Item as T;
	},
	delete: async ({
		pkKey = 'id',
		pkValue,
		tableName
	}: {
		pkKey?: string;
		pkValue: string;
		tableName: string;
	}) => {
		const params = {
			TableName: tableName,
			Key: {
				[`${pkKey}`]: pkValue
			}
		};

		return ddbClient.send(new DeleteCommand(params));
	},
	query: async <T = Item>({
		tableName,
		index,
		pkKey = 'pk',
		pkValue,
		skKey,
		skMin,
		skValue,
		skMax,
		skBeginsWith,
		limit,
		startFromRecord
	}: {
		tableName: string;
		index: string;

		pkKey?: string;
		pkValue: string;
		skKey?: string;
		skValue?: string;
		skMin?: number | string;
		skMax?: number | string;
		skBeginsWith?: string;
		limit?: number;
		startFromRecord?: Record<string, string>;
	}) => {
		if (skKey && !(skMin || skMax || skValue || skBeginsWith)) {
			throw Error('Need a skMin, skMax, skBeginsWith or skValue when a skKey is provided');
		}

		const skminExp = skMin ? `${skKey} > :skvaluemin` : '';
		const skmaxExp = skMax ? `${skKey} < :skvaluemax` : '';
		const skEqualsExp = skValue ? `${skKey} = :skkeyvalue` : '';
		const skBeginsWithExp = skBeginsWith ? `begins_with (${skKey}, :skBeginsWith)` : '';

		const skKeyExp =
			skMin && skMax
				? `${skKey} BETWEEN :skvaluemin AND :skvaluemax`
				: skminExp || skmaxExp || skEqualsExp || skBeginsWithExp;

		const params: QueryCommandInput = {
			TableName: tableName,
			IndexName: index,
			KeyConditionExpression: `${pkKey} = :pkvalue${skKey ? ` AND ${skKeyExp}` : ''}`,
			ExpressionAttributeValues: {
				':pkvalue': pkValue
			},
			Limit: limit,
			ExclusiveStartKey: startFromRecord ? startFromRecord : undefined
		};

		if (!skKey) {
			delete params.ExpressionAttributeValues[':skvaluemax'];
			delete params.ExpressionAttributeValues[':skvaluemin'];
		} else {
			if (skMin) {
				params.ExpressionAttributeValues[':skvaluemin'] = skMin;
			}
			if (skMax) {
				params.ExpressionAttributeValues[':skvaluemax'] = skMax;
			}
			if (skValue) {
				params.ExpressionAttributeValues[':skkeyvalue'] = skValue;
			}
			if (skBeginsWith) {
				params.ExpressionAttributeValues[':skBeginsWith'] = skBeginsWith;
			}
		}

		const command = new QueryCommand(params);
		const res = await ddbClient.send(command);

		return res.Items as T[];
	},
	update: async ({
		tableName,
		pkKey,
		pkValue,
		skKey,
		skValue,
		updateKey,
		updateValue
	}: {
		tableName: string;
		pkKey: string;
		pkValue: string;
		skKey?: string;
		skValue?: string;
		updateKey: string;
		updateValue: string;
	}) => {
		const params: UpdateCommandInput = {
			TableName: tableName,
			Key: { [pkKey]: pkValue },
			UpdateExpression: `set #updateKey = :updateValue`,
			ExpressionAttributeValues: {
				':updateValue': updateValue,
				':pkValue': pkValue
			},
			ExpressionAttributeNames: {
				'#updateKey': updateKey,
				'#pkKey': pkKey
			},
			ReturnValues: 'ALL_NEW',
			ConditionExpression: `#pkKey = :pkValue`
		};
		if (skKey && skValue) {
			params.Key[skKey] = skValue;
		}

		const res = await ddbClient.send(new UpdateCommand(params));

		return res.Attributes;
	},
	scan: async <T = Item>(tableName: string) => {
		const params: ScanCommandInput = {
			TableName: tableName
		};
		const command = new ScanCommand(params);
		const res = await ddbClient.send(command);
		return res.Items as T[];
	},
	updateVideoStatus: async ({
		tableName,
		pkKey,
		pkValue,
		updateValue
	}: {
		tableName: string;
		pkKey: string;
		pkValue: string;
		updateValue: string;
	}) => {
		const params: UpdateCommandInput = {
			TableName: tableName,
			Key: { [pkKey]: pkValue },
			UpdateExpression: 'set conversionStatus = :r',
			ExpressionAttributeValues: {
				':r': updateValue
			},
			ReturnValues: 'UPDATED_NEW'
		};

		const res = await ddbClient.send(new UpdateCommand(params));
		return res.Attributes;
	},
	findRecord: async (
		tableName: string,
		commandParams: {
			filterExpression: string,
			expressionAttributeNames: {
				[key: string]: string
			},
			expressionAttributeValues: {
				[key: string]: string
			},
			projectionExpression?: string,
			pageSize?: number,
			exclusiveStartKey: QueryCommandInput["ExclusiveStartKey"]
		}) => {
		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: commandParams.filterExpression,
			ExpressionAttributeNames: commandParams.expressionAttributeNames,
			ExpressionAttributeValues: commandParams.expressionAttributeValues,
			ProjectionExpression: commandParams.projectionExpression,
			Limit: commandParams.pageSize ?? 20,
			ConsistentRead: true,
		});

		const res = await docClient.send(command);
		return res.Items
	},
	queryRecord: async (
		tableName: string,
		commandParams: {
			filterExpression: string,
			expressionAttributeNames: {
				[key: string]: string
			},
			expressionAttributeValues: {
				[key: string]: string
			},
			projectionExpression?: string,
			pageSize?: number,
			lastRecord: ScanCommandInput["ExclusiveStartKey"]
		}) => {

		const tableParams = {
			TableName: tableName,
			FilterExpression: commandParams.filterExpression,
			ExpressionAttributeNames: commandParams.expressionAttributeNames,
			ExpressionAttributeValues: commandParams.expressionAttributeValues,
			ProjectionExpression: commandParams.projectionExpression,
			Limit: commandParams.pageSize,
			ConsistentRead: true
		}
		let command = new ScanCommand(tableParams);

		if (commandParams.lastRecord) {
			command = new ScanCommand({
				...tableParams,
				ExclusiveStartKey: commandParams.lastRecord
			})
		}
	
		const res = await docClient.send(command);
		return {
			lastEvaluateKey: res.LastEvaluatedKey,
			items: res.Items
		}
	},
	tableRowCount: async (tableName: string) => {
		const commandParams = {
			TableName: tableName
		}
		const command = new DescribeTableCommand(commandParams);
		const res = await docClient.send(command)
		return {
			itemCount: res.Table.ItemCount
		};
	}
};

export default Dynamo;
