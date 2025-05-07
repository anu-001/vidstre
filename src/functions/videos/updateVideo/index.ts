import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';

import { UsersRecord, VideoRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { getCognitoUserByEmail } from '@libs/cognito';
import { parseFormData } from 'src/utils/utils';
import { VIDEOS_TABLE, PRESIGNED_URL_UPLOAD_BUCKET, IMAGE_BUCKET, USERS_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';
import { uploadImageToS3 } from '@libs/s3-client';

dotenv.config();

export const createVideoData = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const videoId = event?.queryStringParameters?.id;
		const { file, fields } = parseFormData(event);
		const { category: categoryName, title, description } = fields;
		let thumbnailURL;
		const key = file?.filename?.filename;
		const mimeType = file?.filename?.mimeType;
		const body = file?.content;

		if (!key) {
			return sendResponse(400, {
				message: 'Query parameter for filename is empty'
			});
		}
		const { Location } = await uploadImageToS3(IMAGE_BUCKET, key, body, mimeType);
		if (Location) {
			thumbnailURL = Location;
		}
		const signedURL = await s3.getSignedUrlPromise('putObject', {
			Bucket: `${PRESIGNED_URL_UPLOAD_BUCKET}`,
			Key: key,
			ContentType: mimeType,
			Expires: 3600 // URL expires in 1 hour
		});

		const email = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(email);
		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		const timestamp = Date.now();
		// let categoryRecord: CategoriesRecord;
		const videoRecord: VideoRecord = {
			id: videoId,
			pk: title,
			sk: `${categoryName}#${timestamp}#${cognitoUser.email}`,
			title,
			thumbnail: thumbnailURL,
			description,
			signedUrl: signedURL || '',
			filename: key,
			createdBy: cognitoUser.email,
			dateCreated: timestamp,
			likes: 0,
			dislikes: 0,
			views: 0,
			category: categoryName,
			creatorName: `${user.firstName} ${user.lastName}`,
			creatorImgURL: user.imgURL || '',
			creatorEmail: email,
			creatorRole: user.role
		};

		const data = await Dynamo.write({
			tableName: VIDEOS_TABLE,
			data: videoRecord
		});

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateVideo = middyfy(createVideoData);
