import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { listInvoices } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

export const retrieveStripeInvoices = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const limit = event?.queryStringParameters?.limit || 10;
		const invoices = await listInvoices(+limit);

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ invoices }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveInvoices = middyfy(retrieveStripeInvoices);
