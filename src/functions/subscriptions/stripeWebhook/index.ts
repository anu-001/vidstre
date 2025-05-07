import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import dotenv from 'dotenv';
import { webhookHandlerMapping } from '@libs/stripe';
import { STRIPE_SECRET_KEY } from 'src/utils/env';

dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(STRIPE_SECRET_KEY);

export const stripeWebhook = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) {
			return sendResponse(400, { message: 'Empty webhooks body', code: 'stripe-error' });
		}
		const signature = event.headers['Stripe-Signature'];
		const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
		const webhookEvent = stripe.webhooks.constructEvent(event.body, signature, signingSecret);
		const dataObject = webhookEvent.data.object as any;
		const handler = webhookHandlerMapping[webhookEvent.type];
		if (!handler) {
			return sendResponse(400, { message: 'Unexpected event type', code: 'stripe-error' });
		}
		await handler(dataObject);
		return sendResponse(httpStatusCode.CREATED, {
			message: 'Webhook event successful!'
		});
	} catch (error) {
		console.log('webhook-error', error);
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const paymentWebhook = stripeWebhook;
