import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { parseFormData } from '../../../utils/utils';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import { IMAGE_BUCKET, USERS_TABLE } from 'src/utils/env';
import { updateUser as updateProfileDetails } from 'src/repository';
import { createStripeCustomer } from '@libs/stripe';
import Dynamo from '@libs/Dynamo';
import { encryptData } from '@libs/crypto-client';
import { uploadImageToS3 } from '@libs/s3-client';

dotenv.config();

export const updateUser: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const response = await getCognitoUserByEmail(email);
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: USERS_TABLE
		})
		const timestamp = Date.now();
		const { file, fields } = await parseFormData(event);

		const { username, firstName, lastName, website, company } = fields;

		if (username) {
			const userAlredyExists = await Dynamo.findRecord(
				USERS_TABLE, {
					filterExpression: 'username = :un',
					expressionAttributeValues: {
						":un": `${username}`
					}
				})
				if (userAlredyExists?.length > 0) {
					return sendResponse(httpStatusCode.BAD_REQUEST, {
						message: 'Username is already taken, please use a different one.'
					});
				}
		}

		let updatedUserRecord: UsersRecord = {
			...user,
			website: website ?? ''
		};

		if (user.role === 'consumer') {
			updatedUserRecord = {
				...user,
				username: username,
				dateUpdated: timestamp,
				firstName: firstName,
				lastName: lastName,
				website: website ?? ''
			};
		}
		
		if (user?.role === 'superadmin' || user?.role === 'admin') {
			updatedUserRecord = {
				...user,
				username: username,
				dateUpdated: timestamp,
				website: website ?? '',
				company: company ?? ''
			};
		}

		if (user?.role === 'consumer' && !user?.customerId) {
			const stripeCustomer = await createStripeCustomer(email, `${username || firstName}`);

			updatedUserRecord = {
				...updatedUserRecord,
				customerId: stripeCustomer.id
			};
		}

		let imgURL: string = user?.imgURL ?? '';

		if (file) {
			const { content: body, filename } = file
			const { Location } = await uploadImageToS3(
				IMAGE_BUCKET,
				filename?.filename,
				body,
				filename?.mimeType
			);

			if (Location) {
				imgURL = Location;
			}
		}

		const userData = await updateProfileDetails({
			...updatedUserRecord,
			imgURL
		});

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ user: userData }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateUserProfile = middyfy(updateUser);