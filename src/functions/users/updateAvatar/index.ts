import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { parseFormData } from '../../../utils/utils';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import { UsersRecord } from 'src/types/dynamo';
import { IMAGE_BUCKET, USERS_TABLE } from 'src/utils/env';
import { updateUser } from 'src/repository';
import Dynamo from '@libs/Dynamo';
import { encryptData } from '@libs/crypto-client';
import { uploadImageToS3 } from '@libs/s3-client';

dotenv.config();

export const updateAvatar: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const response = await getCognitoUserByEmail(email);
		const updatedBy = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: USERS_TABLE
		});
		const { file, fields } = await parseFormData(event);
		const {
			username,
			userId
		} = fields

		const user  = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: userId,
			tableName: USERS_TABLE
		});

		let updatedUserRecord: UsersRecord = {
			...user,
			username,
			updatedBy: updatedBy.id
		};

		let imgURL: string = user?.imgURL ?? '';

		if (file) {
			const { content: body, filename } = file
			const { Location } = await uploadImageToS3(
				`${IMAGE_BUCKET}`,
				filename?.filename,
				body,
				filename?.mimeType
			);

			if (Location) {
				imgURL = Location;
			}
		}

		const userData = await updateUser({
			...updatedUserRecord,
			imgURL
		});

		const { pk, sk, ...data } = userData;
		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateUserAvatar = middyfy(updateAvatar);
