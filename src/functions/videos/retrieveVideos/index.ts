import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import Dynamo from '@libs/Dynamo';
import { VIDEOS_TABLE } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const getVideos = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const { pageLimit } = event.pathParameters
		const { lastRecord } = event.body

		const {
			currentLastEvaluateKey,
			tableFilters
		} = JSON.parse(decryptData(lastRecord))

		const { dateRange, filters } = tableFilters

		const { itemCount } = await Dynamo.tableRowCount(VIDEOS_TABLE)
		let queryCommands = {
			pageSize: pageLimit ? Number(pageLimit) : itemCount,
			lastRecord: Object.values(currentLastEvaluateKey).length > 0 && currentLastEvaluateKey
		}

		if (Array.isArray(filters) && filters.length > 0) {
			let filterValue = filters[filters.length - 1]
			if (filters.includes('video-title')) {
				if (filters.includes('contains')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `contains(title, :vt)`,
						expressionAttributeValues: {
							":vt": `${filterValue}`
						}
					}
				} else if (filters.includes('starts-with')) {
					queryCommands = {
						...queryCommands,
						filterExpression: `begins_with(title, :vt)`,
						expressionAttributeValues: {
							":vt": `${filterValue}`
						}
					}
				} else {
					queryCommands = {
						...queryCommands,
						filterExpression: `contains(subscriptionType, :vt)`,
						expressionAttributeValues: {
							":vt": filterValue
						}
					}
				}
			} else if (filters.includes('uploaded-by') || filters.includes('ends-with')) {
				if (filters.includes('contains')) {
					const tableColumnsFilterCondtions = [
						'contains(creatorEmail, :ub)',
						'(contains(creatorName, :ub))'
					].join(' OR ')
					queryCommands = {
						...queryCommands,
						filterExpression: tableColumnsFilterCondtions,
						expressionAttributeValues: {
							":ub": `${filterValue}`
						}
					}
				} else if (filters.includes('starts-with')) {
					const tableColumnsFilterCondtions = [
						'begins_with(creatorEmail, :ub)',
						'(begins_with(creatorName, :ub))'
					].join(' OR ')
					queryCommands = {
						...queryCommands,
						filterExpression: tableColumnsFilterCondtions,
						expressionAttributeValues: {
							":ub": `${filterValue}`
						}
					}
				}
			} else if (filters.includes('user-role')) {
				if (filters.includes('contains') || filters.includes('ends-with')) {
					const tableColumnsFilterCondtions = [
						'contains(creatorRole, :vr)',
						'(contains(creatorRole, :vr))'
					].join(' OR ')
					queryCommands = {
						...queryCommands,
						filterExpression: tableColumnsFilterCondtions,
						expressionAttributeValues: {
							":vr": `${filterValue}`
						}
					}
				} else if (filters.includes('starts-with')) {
					const tableColumnsFilterCondtions = [
						'begins_with(creatorRole, :vr)',
						'(creatorRole(creatorRole, :vr))'
					].join(' OR ')
					queryCommands = {
						...queryCommands,
						filterExpression: tableColumnsFilterCondtions,
						expressionAttributeValues: {
							":vr": `${filterValue}`
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
		} = await Dynamo.queryRecord(VIDEOS_TABLE, queryCommands)
		
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({
				total: itemCount,
				videos: results,
				lastEvaluateKey
			}))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveVideos = middyfy(getVideos);
