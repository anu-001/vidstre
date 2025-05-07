import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { retrieveProduct } from '@libs/stripe';
import { encryptData } from '@libs/crypto-client';

export const retrieveProductById = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { productId } = event.pathParameters;
		const product = await retrieveProduct(productId);
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(product))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getProduct = middyfy(retrieveProductById);
