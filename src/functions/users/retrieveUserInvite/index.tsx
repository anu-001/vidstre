import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { findUserInvite } from '../../../repository'
import { encryptData } from '../../../libs/crypto-client';

dotenv.config();

export const getUserInviteById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const { inviteId } = event.pathParameters

		const userInvite = await findUserInvite(inviteId);
		
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ userInvite }))
		});

	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getUserInvite = middyfy(getUserInviteById);
