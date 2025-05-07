import dotenv from 'dotenv';
import { SQSHandler, SQSEvent } from "aws-lambda";
import Dynamo from '@libs/Dynamo';
import sendMail from '@libs/sendMail';
import { CLIENT_BASE_URL, INVITES_TABLE, USERS_TABLE, USER_POOL_ID } from 'src/utils/env';
import emailConfig from '@libs/emailConfig';
import { deleteSQSMessage } from '@libs/sqsClient';
import { adminDeleteUser } from '@libs/cognito';
import { cancelStripeSubscription } from '@libs/stripe';

dotenv.config();

export const processUserInvitesSQSMessages: SQSHandler = async (event: SQSEvent): Promise<void> => {
	try {
		console.log(`Beginning to process ${event.Records.length} SQS messages...`);

		const savedRecords = await Promise.all(
			event.Records.map(async (record) => {
				const { body, receiptHandle } = record
				const { userInvite, userAccountMessage } = JSON.parse(body)
				console.log('Received messages....User Invite Message', userInvite, '\nUser Account Message...', userAccountMessage)
				let newInvite
				const { itemCount: inviteTotal } = await Dynamo.tableRowCount(INVITES_TABLE)
				const inviteQueryCommands = {
					pageSize: inviteTotal
				}
				if (userInvite) {
					const {
						items: userInvites
					} = await Dynamo.queryRecord(INVITES_TABLE, {
						...inviteQueryCommands,
						filterExpression: 'contains(email, :sbt)',
						expressionAttributeValues: {
							":sbt": `${userInvite.email}`
						}
					})

					if (userInvites && userInvites.length > 0) {
						const deletedInvites = await Promise.all(
							userInvites.map(async (userInvite) => {
								return await Dynamo.delete({
									tableName: INVITES_TABLE,
									pkValue: userInvite.id,
								})
							})
						)
						console.log('Deleted invites..', deletedInvites)
					}
					if (userInvites?.length === 0) {
						newInvite = await Dynamo.write({
							tableName: INVITES_TABLE,
							data: userInvite
						})
						const {
							email,
							firstName,
							id: userInviteKey,
							role
						} = newInvite
	
						await sendMail(
							email,
							emailConfig.inviteSubject,
							emailConfig.inviteBody(
								firstName,
								`${CLIENT_BASE_URL}/signup/accepting-invite/${userInviteKey}`,
								role
							)
						);
						
						console.log('Email is being sent to ---->', firstName, 'invite link ---->', `${CLIENT_BASE_URL}/signup/accepting-invite/${userInviteKey}`)
						deleteSQSMessage(receiptHandle)
						console.log('Sent message to delete message---->', receiptHandle)
					}
					return newInvite
				} else if (userAccountMessage) {
					const { email } = userAccountMessage
					const { itemCount: userTotal } = await Dynamo.tableRowCount(USERS_TABLE)
					const userQueryCommands = {
						pageSize: userTotal
					}
			
					const {
						items: userAccounts
					} = await Dynamo.queryRecord(USERS_TABLE, {
						...userQueryCommands,
						filterExpression: 'contains(email, :sbt)',
						expressionAttributeValues: {
							":sbt": `${email}`
						}
					})
					console.log('Matching user account...', userAccounts)

					const {
						items: userInvites
					} = await Dynamo.queryRecord(INVITES_TABLE, {
						...inviteQueryCommands,
						filterExpression: 'contains(email, :sbt)',
						expressionAttributeValues: {
							":sbt": `${email}`
						}
					})
					console.log('Matching user invite account...', userInvites)
	
					if (userInvites && userInvites.length > 0) {
						const deletedInvites = await Promise.all(
							userInvites.map(async (userInvite) => {
								return await Dynamo.delete({
									tableName: INVITES_TABLE,
									pkValue: userInvite.id,
								})
							})
						)
						console.log('Deleted invites..', deletedInvites)
					}
		
					if (userAccounts && userAccounts?.length > 0) {
						const deletedAccounts = await Promise.all(
							userAccounts?.map(async (userAccount) => {
								const { id: userId, subscriptionId } = userAccount
								if (subscriptionId) {
									cancelStripeSubscription(subscriptionId);
									console.log('Canceled stribe subscription', userId, subscriptionId)
								}
	
								adminDeleteUser({
									UserPoolId: USER_POOL_ID,
									Username: userId,
								})
								console.log('Deleted user from incognito user pool', userId, USER_POOL_ID)
								const deleted = await Dynamo.delete({
									tableName: USERS_TABLE,
									pkValue: userId,
								})
								return deleted
							})
						)
						console.log('Deleted accounts..', deletedAccounts)
					}
					return []
				}
			})
		)

		console.log(`Processed ${savedRecords.filter(savedRecords => !Array.isArray(savedRecords)).length} SQS messages...`);
  } catch (error) {
    console.log('Failed processing SQS Message -->', error);
  }
};