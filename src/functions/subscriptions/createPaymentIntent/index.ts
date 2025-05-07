import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { createStripePaymentIntent } from '@libs/stripe';
import { updateUser } from 'src/repository';
import { getCognitoUserByEmail } from '@libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';
import Dynamo from '@libs/Dynamo';

dotenv.config();

export const createCustomerPaymentIntent = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { priceId, customerId } = event.body;
		const email = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (!user?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You do not have permissions to create payments!'
			});
		}

		const paymentIntent = await createStripePaymentIntent(customerId, priceId, email);

		const updatedUser = await updateUser({ ...user, paymentIntentId: paymentIntent.id });

		return sendResponse(httpStatusCode.OK, {
			data: {
				user: updatedUser,
				clientSecret: paymentIntent.client_secret
			}
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const createPaymentIntent = middyfy(createCustomerPaymentIntent);
