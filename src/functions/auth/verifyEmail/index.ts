import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { updateUser } from '../../../repository';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const verifyUserEmail: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { userVerification } = event.body;
		const { userId } = JSON.parse(decryptData(userVerification))
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: userId,
			tableName: USERS_TABLE
		});

		if (!user?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				data: encryptData(JSON.stringify({ message: 'Can not verify email, email does not exist.' }))
			});
		}

		if (user?.isEmailVerified) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				data: encryptData(JSON.stringify({ message: 'Email is already verified!.' }))
			});
		}

		await updateUser({ ...user, isEmailVerified: true });

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ message: 'Your email has been verified successfully.' }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const verifyEmail = middyfy(verifyUserEmail);
