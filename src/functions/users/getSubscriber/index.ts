import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { retrieveStripeCustomerInvoices, retrieveStripeSubscription } from '@libs/stripe';
import { USERS_TABLE } from 'src/utils/env';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { encryptData } from '@libs/crypto-client';
dotenv.config();

export const getUserById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const { userId } = event.pathParameters

	const user = await Dynamo.get<UsersRecord>({
		pkKey: 'id',
		pkValue: userId,
		tableName: USERS_TABLE
	});
	const dateCreatedISO = new Date(user.dateCreated).toISOString()
	let subscriber = {
		user,
		dateCreatedISO
	}
	try {
		if (user?.subscriptionId && user?.customerId) {
			const { subscriptionId, customerId } = user;
			const subscription = await retrieveStripeSubscription(subscriptionId);
			const invoices = await retrieveStripeCustomerInvoices(customerId, 10);

			subscriber = {
				...subscriber,
				subscription,
				invoices
			} as any;
		}

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ subscriber }))
		});
	} catch (error) {
		const { code } = error
		if (code === 'resource_missing') {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({ subscriber }))
			});
		}
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getUser = middyfy(getUserById);
