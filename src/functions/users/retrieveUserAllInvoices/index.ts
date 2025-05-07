import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { retrieveStripeCustomerInvoices } from '@libs/stripe';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import Dynamo from '@libs/Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const retrieveUserInvoices = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { email } = event.body;
		const response = await getCognitoUserByEmail(email);
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: USERS_TABLE
		});

		const { customerId } = user;
		if (!customerId) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: 'CustomerId must not be empty, update your profile!'
			});
		}
		const limit = event?.queryStringParameters?.limit || 10;
		const invoices = await retrieveStripeCustomerInvoices(customerId, +limit);
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ user, invoices }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveSubscriberAllInvoices = middyfy(retrieveUserInvoices);
