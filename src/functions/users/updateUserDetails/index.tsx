import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { updateUser } from '../../../repository';
import { createStripeCustomer } from '../../../libs/stripe';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import { USERS_TABLE } from '../../../utils/env';
import { UsersRecord } from '../../../types/dynamo';
import Dynamo from '../../../libs/Dynamo';
import { encryptData } from '../../../libs/crypto-client';

dotenv.config();

export const updateDetails: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		let { updateData } = event.body;
		let { id, email } = updateData

		if (email) {
			const cognitoUser = await getCognitoUserByEmail(email);
			id = cognitoUser.sub
		}
	
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: id,
			tableName: USERS_TABLE
		})

		const { customerId, firstName, role  } = user

		if (!customerId && firstName && role !== 'superadmin' || role !== 'admin') {
			const data = await createStripeCustomer(email, firstName)
			updateData = {
				...updateData,
				customerId: data.id
			}
		}

		if (id) {
			updateData = {
				...user,
				...updateData,
			}
		} else if (email) {
			updateData = {
				...user,
				...updateData,
			}
		}

		const updatedUser = await updateUser(updateData)
		
		const { pk, sk, ...data } = updatedUser;
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateUserDetails = middyfy(updateDetails);