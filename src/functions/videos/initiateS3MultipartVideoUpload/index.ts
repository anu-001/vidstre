import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { UsersRecord, VideoRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { getCognitoUserByEmail } from '@libs/cognito';
import { VIDEOS_TABLE, IMAGE_BUCKET, USERS_TABLE, PRESIGNED_URL_UPLOAD_BUCKET } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';
import { parseFormData } from 'src/utils/utils';
import { uploadImageToS3, createS3MultipartUpload } from '@libs/s3-client';
import { randomUUID } from 'crypto';

dotenv.config();

export const initiateS3MultipartUpload: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (user?.role !== 'superadmin') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You do not have permissions to upload content'
			});
		}

		const { file, fields } = await parseFormData(event);
		const {
			videoName,
			title,
			description,
			categories,
			tags,
		} = fields
		const { content: body, filename } = file
		let videoThumbnail: string = '';

		if (!filename.filename) {
			return sendResponse(400, {
				message: 'Thumbnail name is required!'
			});
		}
		if (!videoName) {
			return sendResponse(400, {
				message: 'Video name is required!'
			});
		}

		const { Location } = await uploadImageToS3(
			IMAGE_BUCKET,
			filename?.filename,
			body,
			filename?.mimeType
		);

		if (Location) {
			videoThumbnail = Location;
		}

		const timestamp = Date.now();
		const vidoeId = randomUUID();
		const partedVideoName = videoName.split('.')
		const updatedFileName = partedVideoName[0] + '_' + vidoeId + '.' + partedVideoName[1]
		const videoRecord: VideoRecord = {
			id: vidoeId,
			pk: title,
			sk: `${categories}#${timestamp}#${cognitoUser.email}`,
			title,
			category: categories,
			tags,
			thumbnail: videoThumbnail,
			description,
			signedUrl: '',
			filename: updatedFileName,
			creatorEmail: user.email,
			creatorName: `${user?.firstName} ${user?.lastName}`,
			creatorImgURL: user?.imgURL ?? '',
			creatorRole: user.role,
			dateCreated: timestamp,
			dateCreatedISO: new Date(timestamp).toISOString(),
			dateUpdated: timestamp,
			likes: 0,
			dislikes: 0,
			views: 0,
			featured: false
		};

		const { filename: videoFileame } = await Dynamo.write({
			tableName: VIDEOS_TABLE,
			data: videoRecord
		});

		const { UploadId: fileId, Key: fileKey } = await createS3MultipartUpload(`${PRESIGNED_URL_UPLOAD_BUCKET}`, videoFileame)

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify({
				fileId,
				fileKey
			}))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const initiateS3MultipartVideoUpload = middyfy(initiateS3MultipartUpload);
