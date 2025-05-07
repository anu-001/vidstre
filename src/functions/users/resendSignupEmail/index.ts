import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import { getCognitoUserByEmail } from '@libs/cognito';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const sendSignupEmail: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { resendEmail } = event.body;
		const { email } = JSON.parse(decryptData(resendEmail))

		if (!email) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Email is required!`
			});
		}
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (!user.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `User email does not exist!`
			});
		}

		await sendMail(email, emailConfig.userSignupSubject, emailConfig.userRegistration(user.id));
		
		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify({ message: 'Email has been resent successfully.' }))
		});
	} catch (error) {
		return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
	}
};

export const resendSignupEmail = middyfy(sendSignupEmail);
