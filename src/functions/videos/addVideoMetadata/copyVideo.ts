import dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import { PRESIGNED_URL_UPLOAD_BUCKET, VIDEO_INPUT_DEST_BUCKET } from '../../../utils/env';

dotenv.config();

const s3 = new AWS.S3();

const copyVideoFile = async (destKey: string, videoId) => {
	const fileName = destKey.split('.');
	const fileKey = fileName[0] + '_' + videoId + '.' + fileName[1];
	const params = {
		Bucket: VIDEO_INPUT_DEST_BUCKET,
		Key: fileKey,
		CopySource: encodeURI(`${PRESIGNED_URL_UPLOAD_BUCKET}/${destKey}`),
		ServerSideEncryption: 'AES256'
	};
	return await s3.copyObject(params).promise();
};

export default copyVideoFile;
