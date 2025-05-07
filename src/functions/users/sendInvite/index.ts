import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import cryptoRandomString from 'crypto-random-string';

import { CLIENT_BASE_URL, INVITES_TABLE, USERS_TABLE } from 'src/utils/env';
import { getCognitoUserByEmail } from '@libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { IInviteUser } from 'src/types/api.types';
import { sendSQSMessage } from '@libs/sqsClient';
import { decryptData, encryptData } from '@libs/crypto-client';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';

dotenv.config();

export const inviteUser: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const invitingAdminEmail = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(invitingAdminEmail);

		const invitingUser = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (!invitingUser?.role || invitingUser.role !== 'superadmin') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Permission denied, you need superadmin access to invite users.'
			});
		}

		const { inviteData } = event.body;
		let { userInvites } = JSON.parse(decryptData(inviteData))
		const timestamp = Date.now();

		if (userInvites.length === 1) {
			const userInvite = userInvites[0]
			const userAlredyExists = await Dynamo.findRecord(
				USERS_TABLE, {
					filterExpression: 'email = :e',
					expressionAttributeValues: {
						":e": `${userInvite.email}`
					}
				})
			if (userAlredyExists?.length === 0) {
				const inviteKey = cryptoRandomString({ length: 10 });
				const newUserInvite = await Dynamo.write({
					tableName: INVITES_TABLE,
					data: {
						...userInvite,
						id: inviteKey
					}
				})
				const {
					email,
					firstName,
					id: userInviteKey,
					role
				} = newUserInvite

				await sendMail(
					email,
					emailConfig.inviteSubject,
					emailConfig.inviteBody(
						firstName,
						`${CLIENT_BASE_URL}/signup/accepting-invite/${userInviteKey}`,
						role
					)
				);
			}
		} else {
			userInvites = await Promise.all(
				userInvites.map(async (userInvite: IInviteUser) => {
					const inviteKey = cryptoRandomString({ length: 10 });
					return sendSQSMessage({
							userInvite: {
							...userInvite,
							id: inviteKey,
							status: 'pending',
							dateCreated: timestamp,
							dateUpdated: timestamp,
							pk: 'id',
							sk: `role#${inviteKey}`,
							inviteKey,
							invitedBy: `${invitingUser?.firstName} ${invitingUser?.lastName}`
						}
					})
				})
			)
		}

		if (userInvites.length > 0) {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({
					message: `${userInvites.length} invites are being processed successfully...`
				}))
			});
		} else {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({ message: 'Failed processing invites' }))
			})
		}
	} catch (error) {
		if (error?.code === 'ConditionalCheckFailedException') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'An invite with the given email already exists.'
			});
		} else {
			return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
		}
	}
};

export const sendInvite = middyfy(inviteUser);
