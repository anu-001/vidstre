import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import Dynamo from '@libs/Dynamo';
import { VIDEOS_TABLE } from '../../../utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

/**
 * This is temporary implementation
 * This will be implemented with
 * AWS Elastic Search, AWS Kinesis
 * for a better user experience
 */
export const searchVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

		const { itemCount: total } = await Dynamo.tableRowCount(VIDEOS_TABLE)

		let queryCommands = {
			pageSize: total,
			lastRecord: Object.values(currentLastEvaluateKey).length > 0 && currentLastEvaluateKey
		}

		const tableColumnsFilterCondtions = [
			'contains(creatorEmail, :vt)',
			'(contains(creatorName, :vt))',
			'(contains(filename, :vt))',
			'(contains(creatorRole, :vt))',
			'(contains(title, :vt))'
		].join(' OR ')
		
		const {
			lastEvaluateKey,
			items: results
		} = await Dynamo.queryRecord(VIDEOS_TABLE, {
			...queryCommands,
			filterExpression: tableColumnsFilterCondtions,
			expressionAttributeValues: {
				":vt": `${searchTerm}`
			}
		})

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

export const searchVideos = middyfy(searchVideo);
