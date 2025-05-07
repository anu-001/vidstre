import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { PRESIGNED_URL_UPLOAD_BUCKET } from 'src/utils/env';
import { decryptData, encryptData } from '@libs/crypto-client';
import { completeS3MultipartUpload } from '@libs/s3-client';

dotenv.config();

export const completeS3MultipartVideoUpload: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
    const { completedUpload } = event.body
    const { uploadId, uploadFileKey, uploadParts } = JSON.parse(decryptData(completedUpload))
		
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

		const { Location: videoUrl, ETag: videoTag } = await completeS3MultipartUpload(
			PRESIGNED_URL_UPLOAD_BUCKET,
      uploadFileKey,
      uploadId,
			uploadParts
		)

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(JSON.stringify({ videoUrl, videoTag }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const completeS3MultipartFileUpload = middyfy(completeS3MultipartVideoUpload);