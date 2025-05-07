import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { cancelStripeSubscription } from '@libs/stripe';
import { updateUser } from 'src/repository';
import { getCognitoUserByEmail } from '@libs/cognito';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';

dotenv.config();

export const handleSubscription = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { subscriptionId } = event.body;
		const email = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		const timestamp = Date.now();
		const subscription = await cancelStripeSubscription(subscriptionId);

		await updateUser({
			...user,
			subscriptionStatus: subscription.status,
			subscriptionCancellationDate: timestamp
		});

		return sendResponse(httpStatusCode.OK, {
			message: subscription.status
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const cancelSubscription = middyfy(handleSubscription);
