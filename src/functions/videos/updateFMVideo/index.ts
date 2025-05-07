import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';

import { UsersRecord, VideoRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { getCognitoUserByEmail } from '@libs/cognito';
import { parseFormData } from 'src/utils/utils';
import { VIDEOS_TABLE, IMAGE_BUCKET, USERS_TABLE } from 'src/utils/env';
import { encryptData } from '@libs/crypto-client';
import { uploadImageToS3 } from '@libs/s3-client';

dotenv.config();

export const updateVideoMeta = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const { videoId } = event.pathParameters;
		const cognitoUser = await getCognitoUserByEmail(email);

		const user = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})
		
		if (user?.role !== 'superadmin') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You do not have permissions to update video'
			});
		}

		const { file, fields } = await parseFormData(event);
		const {
			title,
			description,
			categories,
			tags,
		} = fields

		const dbVideo = await Dynamo.get<VideoRecord>({
			pkKey: 'id',
			pkValue: videoId,
			tableName: VIDEOS_TABLE
		})

		if (dbVideo?.dateCreated) {
			let videoThumbnail: string = dbVideo?.thumbnail ?? '';

			if (file) {
				const { content: body, filename } = file
				const { Location } = await uploadImageToS3(
					`${IMAGE_BUCKET}`,
					filename?.filename,
					body,
					filename?.mimeType
				);
	
				if (Location) {
					videoThumbnail = Location;
				} else {
					videoThumbnail = dbVideo.thumbnail ?? ''
				}
			}
	
			const timestamp = Date.now();
			
			await Dynamo.write({
				tableName: VIDEOS_TABLE,
				data: {
					...dbVideo,
					dateUpdated: timestamp,
					dateCreatedISO: new Date(dbVideo.dateCreated ?? timestamp).toISOString(),
					updatedBy: `${user.firstName} ${user.lastName}`,
					thumbnail: videoThumbnail,
					title: title ?? dbVideo?.title ?? '',
					description: description ?? dbVideo?.description ?? '',
					category: categories ?? dbVideo?.category ?? '',
					tags: tags ?? dbVideo?.tags ?? '',
				}
			});
	
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({
					message: 'Video metadata has been updated successfully!.'
				}))
			});
		} else {
			return sendResponse(httpStatusCode.OK, {
				data: encryptData(JSON.stringify({
					message: 'This is a corupted video file, it can not be updated.'
				}))
			});
		}
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const updateFMVideo = middyfy(updateVideoMeta);
