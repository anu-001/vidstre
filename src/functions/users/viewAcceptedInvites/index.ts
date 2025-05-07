import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { InviteRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { PLANS_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const retrieveAcceptedInvites = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const limit = event?.queryStringParameters?.limit || 10;
		if (!limit) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid authorizer`
			});
		}
		const sk = undefined;
		const data = await Dynamo.query<InviteRecord>({
			tableName: PLANS_TABLE,
			index: 'index1',
			pkKey: 'pk',
			pkValue: 'id',
			skKey: sk ? 'sk' : undefined
		});

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const viewAcceptedInvites = middyfy(retrieveAcceptedInvites);
