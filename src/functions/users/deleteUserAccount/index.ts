import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';


import { INVITES_TABLE, USERS_TABLE, USER_POOL_ID } from 'src/utils/env';
import { adminDeleteUser, getCognitoUserByEmail } from '@libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { sendSQSMessage } from '@libs/sqsClient';
import { decryptData, encryptData } from '@libs/crypto-client';
import { cancelStripeSubscription } from '@libs/stripe';

dotenv.config();

export const deleteAccount: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const deletingAdminEmail = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(deletingAdminEmail);

		const deletingAdmin = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (!deletingAdmin?.role || deletingAdmin.role !== 'superadmin') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Permission denied, you need superadmin access to delete user accounts.'
			});
		}

		const { deleteData } = event.body;
		let { userAccounts } = JSON.parse(decryptData(deleteData))

		if (userAccounts.length === 1) {
			const { email } = userAccounts[0]
			const userAccount = await Dynamo.findRecord(
				USERS_TABLE, {
					filterExpression: 'email = :e',
					expressionAttributeValues: {
						":e": `${email}`
					}
				})

      const userInvite = await Dynamo.findRecord(
        INVITES_TABLE, {
					filterExpression: 'email = :e',
					expressionAttributeValues: {
						":e": `${email}`
					}
        })

      if (userInvite.length > 0) {
        const { id: inviteKey } = userInvite[0]
        await Dynamo.delete({
          tableName: INVITES_TABLE,
          pkValue: inviteKey,
        })
        console.log('Deleted user from invite table...', userInvite[0])
      }

      if (userAccount?.length > 0) {
        const { id: userId, subscriptionId } = userAccount[0]
        await Dynamo.delete({
          tableName: USERS_TABLE,
          pkValue: userId,
        })

        await adminDeleteUser({
          UserPoolId: USER_POOL_ID,
          Username: userId,
        })
				if (subscriptionId) {
					await cancelStripeSubscription(subscriptionId);
					console.log('Canceled stribe subscription', userId, subscriptionId)
				}
        console.log('Deleted user from user table and incognito and canceled stribe subscription', userAccount[0])
      }
		} else {
			userAccounts = await Promise.all(
				userAccounts.map(async (userAccount: { email: string }) => {
					const { email } = userAccount
					return sendSQSMessage({
            userAccountMessage: { email }
					})
				})
			)
		}

		if (userAccounts.length > 0) {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({
					message: `${userAccounts.length} deletes are being processed successfully...`
				}))
			});
		} else {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({ message: 'Failed processing deletes' }))
			})
		}
	} catch (error) {
    return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
	}
};

export const deleteUserAccount = middyfy(deleteAccount);
