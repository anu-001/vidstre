import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const s3 = new AWS.S3();
import { httpStatusCode, sendResponse } from '../../../libs/api.response';
import { PRESIGNED_URL_UPLOAD_BUCKET } from '../../../utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const getPreSignedUrl = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const objectKey = event?.queryStringParameters?.filename;
		if (!objectKey) {
			return sendResponse(400, {
				message: 'Query parameter for filename is empty'
			});
		}
		const signedURL = await s3.getSignedUrlPromise('putObject', {
			Bucket: `${PRESIGNED_URL_UPLOAD_BUCKET}`,
			Key: objectKey,
			ContentType: 'video/mp4',
			Expires: 3600 // URL expires in 1 hour
		});

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(signedURL)
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const generatePreSignedUrl = middyfy(getPreSignedUrl);
