import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { retrieveStripeSubscriptions } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const retrieveSubscriptions = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const limit = event?.queryStringParameters?.limit || 10;
		const subscriptions = (await retrieveStripeSubscriptions(+limit)) as IStripeSubscription;

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(subscriptions))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveAllSubscriptions = middyfy(retrieveSubscriptions);
