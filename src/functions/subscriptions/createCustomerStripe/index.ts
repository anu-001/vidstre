import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { IStripeCustomer } from 'src/types/stripes.types';
import dotenv from 'dotenv';
import { createStripeCustomer } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const createCustomerStripe = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const data = {
			email: event.requestContext.authorizer.claims['email'],
			name: event.body.username
		};

		const customer = (await createStripeCustomer(data.email, data.name)) as IStripeCustomer;
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(customer))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const createCustomer = middyfy(createCustomerStripe);
