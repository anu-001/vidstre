import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { retrieveStripeCustomerInvoices } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

export const retrieveSubscriberInvoices = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const customerId = event.requestContext.authorizer.claims['custom:customerId'];
		if (!customerId) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: 'CustomerId must not be empty, update your profile!'
			});
		}
		const limit = event?.queryStringParameters?.limit || 10;
		const invoices = await retrieveStripeCustomerInvoices(customerId, +limit);
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(invoices))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getSubscriberInvoices = middyfy(retrieveSubscriberInvoices);
