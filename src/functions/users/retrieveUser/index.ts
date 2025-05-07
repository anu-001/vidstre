import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';

import { UsersRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

const usersTableName = process.env.usersTable;

export const retrieveUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const admin = event?.requestContext?.authorizer?.claims?.email;
		if (!admin) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid authorizer`
			});
		}
		const sub = event?.requestContext?.authorizer?.claims.sub;
		const data = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: sub,
			tableName: usersTableName
		});

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const getUserProfile = middyfy(retrieveUser);
