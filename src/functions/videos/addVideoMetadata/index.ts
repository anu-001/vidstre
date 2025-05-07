import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UsersRecord, VideoRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { getCognitoUserByEmail } from '@libs/cognito';
import { parseFormData } from 'src/utils/utils';
import { randomUUID } from 'crypto';
import { VIDEOS_TABLE, IMAGE_BUCKET, CLIENT_BASE_URL, USERS_TABLE } from 'src/utils/env';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import copyVideoFile from './copyVideo';
import { uploadImageToS3 } from '@libs/s3-client';

dotenv.config();

const createVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const { file, fields } = await parseFormData(event);
		const {
			description,
			title,
			category: categoryName = '',
			filename: fileName,
			signedUrl,
			featured: isFeatured = false
		} = fields;

		const key = fileName;
		const mimeType = file?.filename?.mimeType;
		const body = file?.content;

		const { Location: thumbnailURL } = await uploadImageToS3(
			`${IMAGE_BUCKET}`,
			key,
			body,
			mimeType
		);

		const cognitoUser = await getCognitoUserByEmail(email);
		const creator  = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: cognitoUser.sub,
			tableName: USERS_TABLE
		})

		if (creator?.role !== 'superadmin') {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'You do not have permissions to upload content'
			});
		}

		const timestamp = Date.now();
		const vidoeId = randomUUID();
		const videoRecord: VideoRecord = {
			id: vidoeId,
			pk: title,
			sk: `${categoryName}#${timestamp}#${cognitoUser.email}`,
			title,
			category: categoryName,
			thumbnail: thumbnailURL,
			description,
			signedUrl,
			filename: fileName,
			creatorEmail: cognitoUser.email,
			creatorName: `${creator?.firstName} ${creator?.lastName}`,
			creatorImgURL: creator?.imgURL ?? '',
			creatorRole: creator.role,
			dateCreated: timestamp,
			dateCreatedISO: new Date(timestamp).toISOString(),
			dateUpdated: timestamp,
			likes: 0,
			dislikes: 0,
			views: 0,
			featured: isFeatured
		};

		const data = await Dynamo.write({
			tableName: VIDEOS_TABLE,
			data: videoRecord
		});

		// copy file after video record has been created
		await copyVideoFile(fileName, vidoeId);

		// videoNotificationSubject
		await sendMail(
			cognitoUser.email,
			emailConfig.videoNotificationSubject,
			emailConfig.videoNotificationBody(creator.username, title, `${CLIENT_BASE_URL}/`)
		);

		return sendResponse(httpStatusCode.CREATED, {
			data
		});
	} catch (error) {
		console.error('Error creating video:', error);
		return sendResponse(error.statusCode || httpStatusCode.INTERNAL_SERVER, {
			message: error.message,
			code: error.code
		});
	}
};

const updateVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const email = event.requestContext.authorizer.claims.email;
		const { file, fields } = await parseFormData(event);
		const videoId = fields?.videoId;

		const mimeType = file?.filename?.mimeType;
		const key = file?.filename?.filename;
		const body = file?.content;
		const { Location: thumbnailURL } = await uploadImageToS3(
			`${IMAGE_BUCKET}`,
			key,
			body,
			mimeType
		);

		const user = await getCognitoUserByEmail(email);

		const existingVideo = await Dynamo.get<VideoRecord>({
			pkKey: 'id',
			pkValue: videoId,
			tableName: VIDEOS_TABLE
		});

		const updatedVideo: VideoRecord = {
			...existingVideo,
			pk: fields?.title || existingVideo.title,
			sk: `${fields?.category}#${Date.now()}#${user.email}`,
			title: fields?.title || existingVideo.title,
			category: fields?.category || existingVideo.category,
			thumbnail: thumbnailURL,
			description: fields?.description || existingVideo.description,
			dateUpdated: Date.now(),
			featured: fields.featured || existingVideo.featured
		};

		await Dynamo.write({
			tableName: VIDEOS_TABLE,
			data: updatedVideo
		});

		return sendResponse(httpStatusCode.OK, {
			data: updatedVideo
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

const createOrModifyVideoData = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const { file, fields } = await parseFormData(event);
	const videoId = fields?.videoId;
	return videoId ? updateVideo(event) : createVideo(event);
};

export const addVideoMetadata = middyfy(createOrModifyVideoData);
