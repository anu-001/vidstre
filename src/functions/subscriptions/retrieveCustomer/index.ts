import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { IStripeCustomer } from 'src/types/stripes.types';
import { retrieveStripeCustomer } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

export const retrieveSubscriptionCustomer = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const customer = (await retrieveStripeCustomer(
			event.pathParameters.customerId
		)) as IStripeCustomer;

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(customer))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveCustomer = middyfy(retrieveSubscriptionCustomer);
