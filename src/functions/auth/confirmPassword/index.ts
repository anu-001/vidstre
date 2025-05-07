import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import { setPassword } from '@libs/cognito';
import { CLIENT_BASE_URL, USERS_TABLE } from 'src/utils/env';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const authConfirmPassword = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { resetPayload } = event.body;
		const { userId, newPassword } = JSON.parse(decryptData(resetPayload))

		const dbUser = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: userId,
			tableName: USERS_TABLE
		});

		if (!dbUser?.isEmailVerified) {
			await sendMail(
				dbUser.email,
				emailConfig.userSignupSubject,
				emailConfig.userRegistration(dbUser.id)
			);
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Account is not verified, please check your verification email'
			});
		}

		await setPassword({ email: dbUser.email, password: newPassword });
		const loginlink = `${CLIENT_BASE_URL}/login`;
		sendMail(
			dbUser.email,
			emailConfig.passwordUpdated,
			emailConfig.passwordChanged(dbUser.email, loginlink)
		);
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ message: 'Password has been reset successfully!' }))
		});
	} catch (error) {
		return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
	}
};

export const confirmPassword = middyfy(authConfirmPassword);
