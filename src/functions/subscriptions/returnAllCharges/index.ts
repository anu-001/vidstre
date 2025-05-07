import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { retrieveListOfStripeCharges } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const returnAllCharges = async (event: APIGatewayProxyResult) => {
	try {
		const { paymentIntentId } = event.body;

		const charges = await retrieveListOfStripeCharges(paymentIntentId);

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(charges))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getAllCharges = middyfy(returnAllCharges);
