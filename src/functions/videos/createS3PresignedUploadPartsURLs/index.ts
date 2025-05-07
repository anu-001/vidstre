import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { decryptData, encryptData } from '@libs/crypto-client';
import { generateS3UploadPresignedUrls } from '@libs/s3-client';
import { PRESIGNED_URL_UPLOAD_BUCKET } from 'src/utils/env';

dotenv.config();

export const generateS3PresignedUploadUrls: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
    const { videoUpload } = event.body
    const { uploadId, uploadFileKey, numberOfUploadParts } = JSON.parse(decryptData(videoUpload))
		
		if (!uploadId) {
			return sendResponse(400, {
				message: 'Upload ID is required!'
			});
		}

		if (!uploadFileKey) {
			return sendResponse(400, {
				message: 'Upload file key is required!'
			});
		}

		const multipartPresignedUrls = await generateS3UploadPresignedUrls(
			PRESIGNED_URL_UPLOAD_BUCKET,
      uploadFileKey,
      uploadId,
      numberOfUploadParts
		)

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify({ multipartPresignedUrls }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const createS3PresignedUploadPartsURLs = middyfy(generateS3PresignedUploadUrls);