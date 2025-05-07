import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import Dynamo from '@libs/Dynamo';
import { USERS_TABLE } from '../../../utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';
import { updateUser } from 'src/repository';
import { UsersRecord } from 'src/types/dynamo';

dotenv.config();

/**
 * This is temporary implementation
 * This will be implemented with
 * AWS Elastic Search, AWS Kinesis
 * for a better user experience
 */
export const searchUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const admin = event?.requestContext?.authorizer?.claims?.email;
		if (!admin) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid authorizer`
			});
		}

		const { searchTerm } = event.pathParameters
		const { searchPayload } = event.body

		const {
			currentLastEvaluateKey,
		} = JSON.parse(decryptData(searchPayload))

		const { itemCount: total } = await Dynamo.tableRowCount(USERS_TABLE)

		let queryCommands = {
			pageSize: total,
			lastRecord: Object.values(currentLastEvaluateKey).length > 0 && currentLastEvaluateKey
		}

		const tableColumnsFilterCondtions = [
			'contains(subscriptionStatus, :sbt)',
			'(contains(subscriptionType, :sbt))',
			'(contains(email, :sbt))',
			'(contains(firstName, :sbt))',
			'(contains(lastName, :sbt))',
			'(contains(username, :sbt))',
			'(contains(#ur, :sbt))'
		].join(' OR ')

		const {
			lastEvaluateKey,
			items
		} = await Dynamo.queryRecord(USERS_TABLE, {
			...queryCommands,
			filterExpression: tableColumnsFilterCondtions,
			expressionAttributeNames: {
				"#ur": "role"
			},
			expressionAttributeValues: {
				":sbt": `${searchTerm}`
			}
		})

		const results = await Promise.all(
			(items || []).map(async (user) => {
					const dateCreatedISO = new Date(user.dateCreated).toISOString()
					return user.dateCreatedISO ? user : (await updateUser({ ...user, dateCreatedISO } as UsersRecord))
				}))

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({
				total,
				results,
				lastEvaluateKey
			}))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const searchUsers = middyfy(searchUser);
