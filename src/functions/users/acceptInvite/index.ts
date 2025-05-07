import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { adminCreateUser, initiateAuth, setPassword } from '../../../libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import { INVITES_TABLE, USER_POOL_ID } from 'src/utils/env';
import Dynamo from '@libs/Dynamo';
import { updateUser } from 'src/repository';
import { createStripeCustomer } from '@libs/stripe';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const acceptUser = async (event: APIGatewayProxyResult): Promise<APIGatewayProxyResult> => {
	try {
		const { acceptInvite } = event.body
		const { email, password, dateOfBirth, userInviteData } = JSON.parse(decryptData(acceptInvite));

		if (!userInviteData?.id) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Invite key is required!.'
			});
		}

		if (userInviteData.status === 'accepted') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You have already accepted this invite, please login.'
			});
		}

		const timestamp = Date.now();
		const params = {
			UserPoolId: USER_POOL_ID,
			Username: email,
			UserAttributes: [
				{
					Name: 'email',
					Value: email
				},
				{
					Name: 'email_verified',
					Value: 'true'
				}
			],
			DesiredDeliveryMediums: [],
			MessageAction: 'SUPPRESS'
		};

		const response = await adminCreateUser(params);

		if (response.User) {
			let userRecord: UsersRecord = {
				id: response.User?.Username,
				sk: `email#${timestamp}`,
				email,
				role: userInviteData?.role,
				firstName: userInviteData?.firstName,
				lastName: userInviteData?.lastName,
				iviteKey: userInviteData.id,
				dateCreated: timestamp,
				dateCreatedISO: new Date(timestamp).toISOString(),
			};

			if (userInviteData?.role === 'consumer') {
				const stripeCustomer = await createStripeCustomer(
					email,
					`${userInviteData?.firstName} ${userInviteData?.lastName}`
				);

				userRecord = {
					...userRecord,
					customerId: stripeCustomer.id,
					dateOfBirth
				};

				if (userInviteData.subscription === 'lifelong') {
					userRecord = {
						...userRecord,
						hasPaidSubscription: userInviteData.hasPaid,
						subscriptionType: userInviteData.subscription
					};
				}
			}

			await setPassword({ email, password });

			const result = await initiateAuth({ email, password });

			const accepetedUser = await updateUser({
				...userRecord,
				status: 'accepted',
				isEmailVerified: true
			});

			await Dynamo.write({
				tableName: INVITES_TABLE,
				data: {
					...userInviteData,
					status: 'accepted',
					dateUpdated: timestamp
				}
			});

			return sendResponse(httpStatusCode.CREATED, {
				data: encryptData(JSON.stringify({
					message: 'Invite accepted and registration successful',
					token: result?.AuthenticationResult,
					user: accepetedUser || {}
				}))
			});
		}
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const acceptInvite = middyfy(acceptUser);
