import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { retrieveStripeCustomerInvoices, retrieveStripePaymentIntent, retrieveStripeSubscription } from '@libs/stripe';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { getCognitoUserByEmail } from '@libs/cognito';
import { USERS_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const getUserDetails = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const email = event.requestContext.authorizer.claims.email;
	const cognitoUser = await getCognitoUserByEmail(email);

	const user = await Dynamo.get<UsersRecord>({
		pkKey: 'id',
		pkValue: cognitoUser.sub,
		tableName: USERS_TABLE
	})

	try {
		if (!user?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You do not have permissions view this page'
			});
		}

		if (user?.role === 'consumer') {
			const { subscriptionId, customerId, paymentIntentId } = user;
			let subscription;
			let invoices;
			let paymentIntent

			if (subscriptionId && customerId) {
				subscription = await retrieveStripeSubscription(subscriptionId);
				invoices = await retrieveStripeCustomerInvoices(customerId, 10);
			}

			if (paymentIntentId) {
				paymentIntent = await retrieveStripePaymentIntent(paymentIntentId)
			}

			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({
					user,
					subscription,
					invoices,
					paymentIntent
				}))
			});
		}

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ user }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getUserInformation = middyfy(getUserDetails);
