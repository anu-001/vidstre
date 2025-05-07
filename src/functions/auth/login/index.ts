import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import validator from '@middy/validator';
import { loginInputSchema } from 'src/validations/auth.schema';
import { getCognitoUserByEmail, initiateAuth } from '../../../libs/cognito';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { retrieveStripePaymentIntent, retrieveStripeSubscription } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';
import { updateUser } from 'src/repository';

export const authLogin = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const { email, password } = event.body;
	const cognitoUser = await getCognitoUserByEmail(email);
	let dbUser = await Dynamo.get<UsersRecord>({
		pkKey: 'id',
		pkValue: cognitoUser.sub,
		tableName: USERS_TABLE
	});
	const dateCreatedISO = new Date(dbUser.dateCreated).toISOString()
	try {
		if (!dbUser?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Account is not registered, please signup to create account.'
			});
		}
		if (!dbUser?.isEmailVerified) {
			await sendMail(
				email,
				emailConfig.userSignupSubject,
				emailConfig.userRegistration(dbUser?.id)
			);
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Account is not verified, please check your verification email'
			});
		}

		if (
			!dbUser?.role ||
			!(dbUser.role === 'consumer' || dbUser.role === 'superadmin' || dbUser.role === 'admin')
		) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Permissions to login denied, account does not have supported role.'
			});
		}

		const response = await initiateAuth({ email, password });

		const { role, subscriptionId, subscriptionType, hasPaidSubscription, paymentIntentId } = dbUser
		if (role === 'consumer') {
			if (subscriptionId) {
				const userSubscription = await retrieveStripeSubscription(subscriptionId)
				dbUser = await updateUser({
					...dbUser,
					dateCreatedISO,
					subscriptionStatus: userSubscription.status
				} as UsersRecord)
			} else if (paymentIntentId) {
				const subscriptionPayment = await retrieveStripePaymentIntent(paymentIntentId)
				dbUser = await updateUser({
					...dbUser,
					dateCreatedISO,
					purchaseStatus: subscriptionPayment.status,
					hasPaidSubscription: subscriptionPayment.status === 'succeeded',
					subscriptionStatus: subscriptionPayment.status === 'succeeded' ? 'active' : subscriptionPayment.status
				} as UsersRecord)
			} else if (subscriptionType && hasPaidSubscription) {
				dbUser = await updateUser({
					...dbUser,
					dateCreatedISO,
					subscriptionStatus: 'active'
				} as UsersRecord)
			}
		}

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify({
					token: response.AuthenticationResult,
					user: dbUser
				}))
		});
	} catch (error) {
		const { code } = error
		if (code === 'resource_missing') {
			if (!dbUser?.id) {
				return sendResponse(httpStatusCode.BAD_REQUEST, {
					message: 'Account is not registered, please signup to create account.'
				});
			}
			if (!dbUser?.isEmailVerified) {
				await sendMail(
					email,
					emailConfig.userSignupSubject,
					emailConfig.userRegistration(dbUser?.id)
				);
				return sendResponse(httpStatusCode.BAD_REQUEST, {
					message: 'Account is not verified, please check your verification email'
				});
			}
			if (
				!dbUser?.role ||
				!(dbUser.role === 'consumer' || dbUser.role === 'superadmin' || dbUser.role === 'admin')
			) {
				return sendResponse(httpStatusCode.BAD_REQUEST, {
					message: 'Permissions to login denied, account does not have supported role.'
				});
			}
			const response = await initiateAuth({ email, password });

			return sendResponse(httpStatusCode.CREATED, {
				data: encryptData(JSON.stringify({
						token: response.AuthenticationResult,
						user: await updateUser({
							...dbUser,
							subscriptionId: undefined,
							dateCreatedISO,
							subscriptionStatus: 'resource_missing'
						} as UsersRecord)
					}))
			});
		}
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const login = middyfy(authLogin).use(validator({ inputSchema: loginInputSchema }));
