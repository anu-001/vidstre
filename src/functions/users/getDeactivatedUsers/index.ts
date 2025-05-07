import dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { extractDeactivatedUsers } from '../../../utils/utils';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider();

const { USER_POOL_ID } = process.env;

export const retrieveArchivedUsers = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		// set cognito params for the listUsers method
		const params = {
			UserPoolId: USER_POOL_ID
		};

		// get a list of all users from the specified UserPool
		const { Users } = await cognito.listUsers(params).promise();

		// helper function returns a filtered list of all users with an attribute of custom:isDeactivated = true
		const listOfDeactivatedUsers = extractDeactivatedUsers(Users);

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(listOfDeactivatedUsers))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getDeactivatedUsers = middyfy(retrieveArchivedUsers);
