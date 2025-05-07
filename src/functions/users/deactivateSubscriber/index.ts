import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import {
	cancelStripeSubscription,
	retrieveStripeCustomerSubscriptions,
	updateStripeSubscription
} from '@libs/stripe';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { USERS_TABLE } from 'src/utils/env';

dotenv.config();
const usersTableName = process.env.usersTable;

const deactivateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const adminEmail = event.requestContext.authorizer.claims.email;
		if (!adminEmail) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid authorizer`
			});
		}
		const { email, reason, description } = event.body;

		const response = await getCognitoUserByEmail(email);
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: usersTableName
		});
		const customerId = user.customerId;
		if (!customerId) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `The subscriber customerId is empty`
			});
		}
		if (user.isDeactivated == 'true') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `The subscriber; email:${email} and customerId: ${customerId} has already been deactivated`
			});
		}

		const StripeDetails = await retrieveStripeCustomerSubscriptions(customerId);
		if (StripeDetails.subscriptions.data.length == 0) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: `The subscriber; email:${email} and customerId: ${customerId} does not have an existing subscription`
			});
		}
		await cancelStripeSubscription(StripeDetails.subscriptions.data[0].id);
		const timestamp = Date.now();
		const updatedUserRecord: UsersRecord = {
			...user,
			isDeactivated: 'true',
			deactivationInfo: [
				{
					reason,
					description
				}
			],
			dateUpdated: timestamp,
			dateCreatedISO: new Date(user.dateCreated).toISOString(),
		};

		await Dynamo.write({
			tableName: usersTableName,
			data: { ...updatedUserRecord }
		});

		await sendMail(
			email,
			emailConfig.accountDeactivationSubject,
			emailConfig.accountDeactivationBody(email, reason, description)
		);
		return sendResponse(httpStatusCode.OK, {
			message: `The subscriber has been deactivated`
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

const reactivateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const adminEmail = event.requestContext.authorizer.claims.email;
		if (!adminEmail) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid authorizer`
			});
		}
		const { email, priceId } = event.body;
		const response = await getCognitoUserByEmail(email);
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: USERS_TABLE
		})

		const customerId = user.customerId;
		if (user.isDeactivated !== 'true') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `The subscriber; email:${email} has not been deactivated, you cannot reactivate`
			});
		}
		if (!customerId) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `The subscriber customerId is empty`
			});
		}
		const StripeDetails = await retrieveStripeCustomerSubscriptions(customerId);
		if (StripeDetails.subscriptions.data.length == 0) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: `The subscriber; email:${email} and customerId: ${customerId} does not have an existing subscription`
			});
		}
		const items = [
			{
				id: StripeDetails.subscription.items.data[0].id,
				price: priceId
			}
		];
		updateStripeSubscription(StripeDetails.subscriptions.data[0].id, items);
		const timestamp = Date.now();
		const updatedUserRecord: UsersRecord = {
			...user,
			isDeactivated: false,
			dateUpdated: timestamp,
			dateCreatedISO: new Date(user.dateCreated).toISOString(),
		};

		await Dynamo.write({
			tableName: usersTableName,
			data: { ...updatedUserRecord }
		});

		await sendMail(
			email,
			emailConfig.accountReactivationSubject,
			emailConfig.accountReactivationBody(email)
		);
		return sendResponse(httpStatusCode.OK, {
			message: `The subscriber has been reactivated`
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateSubscriberAccountStatus = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const action: string = event?.queryStringParameters?.action || '';
		const actions = ['deactivate', 'reactivate'];
		if (!actions.includes(action)) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: 'Query parameter "action" must be either "activate" or "deactivate".'
			});
		}
		return action === 'deactivate' ? await deactivateUser(event) : await reactivateUser(event);
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const deactivateSubscriber = middyfy(updateSubscriberAccountStatus);
