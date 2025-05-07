import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { INVITES_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const retrieveUsersInvites = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const userInvites = await Dynamo.scan<UsersRecord>(INVITES_TABLE);

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(userInvites))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const listUserInvites = middyfy(retrieveUsersInvites);
