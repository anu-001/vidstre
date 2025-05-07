import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import Dynamo from '@libs/Dynamo';
import { USERS_TABLE } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';
import { updateUser } from 'src/repository';
import { UsersRecord } from 'src/types/dynamo';

dotenv.config();

export const retrieveUsers = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { pageLimit } = event.pathParameters
		const { lastRecord } = event.body

		const {
			currentLastEvaluateKey,
			tableFilters
		} = JSON.parse(decryptData(lastRecord))

		const { dateRange, filters } = tableFilters

		let queryCommands = {
			pageSize: Number(pageLimit),
			lastRecord: Object.values(currentLastEvaluateKey).length > 0 && currentLastEvaluateKey
		}

		if  (Array.isArray(filters) && filters.length > 0) {
			let filterValue = filters[filters.length - 1]
			if (filters.includes('subscription-type')) {
				filterValue = filters[filters.length - 1].toLowerCase()
				if (filters.includes('is-equal-to')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `subscriptionType = :st`,
						expressionAttributeValues: {
							":st": filterValue
						}
					}
				} else if (filters.includes('starts-with')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `begins_with(subscriptionType, :st)`,
						expressionAttributeValues: {
							":st": filterValue
						}
					}
				} else {
					queryCommands = {
						...queryCommands,
						filterExpression: `contains(subscriptionType, :st)`,
						expressionAttributeValues: {
							":st": filterValue
						}
					}
				}
			} else if (filters.includes('subscription-status')) {
				filterValue = filters[filters.length - 1].toLowerCase()
				if (filters.includes('is-equal-to')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `subscriptionStatus = :ss`,
						expressionAttributeValues: {
							":ss": filterValue
						}
					}
				} else if (filters.includes('starts-with')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `begins_with(subscriptionStatus, :ss)`,
						expressionAttributeValues: {
							":ss": filterValue
						}
					}
				}
			}
		} else if (Array.isArray(dateRange) && dateRange[0]) {
			const {
				startDate,
				endDate
			} = dateRange[0]

			queryCommands = { 
				...queryCommands,
				filterExpression: 'dateCreatedISO BETWEEN :sd AND :ed',
				expressionAttributeValues: {
					":sd": startDate,
					":ed": endDate,
				}
			}
		}

		const {
			lastEvaluateKey,
			items: results
		} = await Dynamo.queryRecord(USERS_TABLE, queryCommands)

		const { itemCount } = await Dynamo.tableRowCount(USERS_TABLE)

		const users = await Promise.all(
			(results || []).map(async (user) => {
					const dateCreatedISO = new Date(user.dateCreated).toISOString()
					return user.dateCreatedISO ? user : (await updateUser({ ...user, dateCreatedISO } as UsersRecord))
				}))
					
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({
				total: itemCount,
				users,
				lastEvaluateKey
			}))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const listUsers = middyfy(retrieveUsers);