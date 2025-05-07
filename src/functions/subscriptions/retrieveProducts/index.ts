import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { listProducts } from '@libs/stripe';
import crypto from 'crypto';
import { encryptData } from '@libs/crypto-client';

export const retrieveProducts = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const products = await listProducts();
		const susbscriptions = products.data.map((item) => {
			const {
				id,
				default_price: { id: priceId, unit_amount: amount, recurring },
				name: subscription,
				description
			} = item;
			return {
				id: crypto.randomUUID(),
				productId: id,
				priceId,
				amount: amount / 100,
				duration: recurring?.interval,
				subscription,
				description,
				currency: '£'
			};
		});

		const formattedSubscriptions = Object.fromEntries(
			susbscriptions.map((subscriptionProduct) => {
				const { subscription } = subscriptionProduct
				return [subscription.toLowerCase(), subscriptionProduct]
			})
		)

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ formattedSubscriptions }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getProducts = middyfy(retrieveProducts);
