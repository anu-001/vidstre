import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { createStripeSubscription } from '@libs/stripe';
import { updateUser } from 'src/repository';
import { getCognitoUserByEmail } from '@libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { IStripeSubscription } from 'src/types/stripes.types';

dotenv.config();

export const createSubscription = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { customerId, priceId } = event.body;
		const email = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		const subscription = (await createStripeSubscription(
			customerId,
			priceId
		)) as IStripeSubscription;

		const updatedUser = await updateUser({ ...user, subscriptionId: subscription.id });

		return sendResponse(httpStatusCode.OK, {
			data: {
				user: updatedUser,
				clientSecret: subscription.latest_invoice.payment_intent.client_secret
			}
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const createCustomerSubscription = middyfy(createSubscription);
