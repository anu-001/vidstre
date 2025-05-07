import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import validator from '@middy/validator';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import { signupInputSchema } from 'src/validations/auth.schema';
import { adminCreateUser, initiateAuth, setPassword } from '../../../libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { USERS_TABLE, USER_POOL_ID } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const authUserSignup = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { signup } = event.body
		const { email, password, dateOfBirth } = JSON.parse(decryptData(signup));
		const params = {
			UserPoolId: USER_POOL_ID,
			Username: email,
			UserAttributes: [
				{
					Name: 'email',
					Value: email
				},
				{
					Name: 'email_verified',
					Value: 'true'
				}
			],
			DesiredDeliveryMediums: [],
			MessageAction: 'SUPPRESS'
		};
		const response = await adminCreateUser(params);
		if (response.User) {
			const timestamp = Date.now();
			await setPassword({ email, password });
			await initiateAuth({ email, password });
			const userRecord: UsersRecord = {
				id: response.User?.Username,
				sk: `email#${timestamp}`,
				email,
				dateOfBirth,
				role: 'consumer',
				dateCreated: timestamp,
				dateCreatedISO: new Date(timestamp).toISOString(),
			};

			await Dynamo.write({
				data: userRecord,
				tableName: USERS_TABLE
			});

			await sendMail(
				email,
				emailConfig.userSignupSubject,
				emailConfig.userRegistration(userRecord.id)
			);
			return sendResponse(httpStatusCode.CREATED, {
				data: encryptData(JSON.stringify({ message: 'User registration successful' }))
			});
		}
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const subscriberSignup = middyfy(authUserSignup).use(
	validator({ inputSchema: signupInputSchema })
);
