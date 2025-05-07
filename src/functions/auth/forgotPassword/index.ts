import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import { CLIENT_BASE_URL, USERS_TABLE } from 'src/utils/env';
import { getCognitoUserByEmail } from '@libs/cognito';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const authForgotPassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const { resetPayload } = JSON.parse(event.body);
		const { email } = JSON.parse(decryptData(resetPayload))
		const cognitoUser = await getCognitoUserByEmail(email);

		const userByEmail = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (!userByEmail?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Email does not exist.'
			});
		}

		const resetLink = `${CLIENT_BASE_URL}/reset-password/${userByEmail.id}`;

		await sendMail(
			email,
			emailConfig.passwordReset,
			emailConfig.passwordLink(userByEmail?.username, resetLink)
		);
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ message: 'An email to reseet passwiord has been sent.' }))
		});
	} catch (error) {
		return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
	}
};

export const forgotPassword = middyfy(authForgotPassword);