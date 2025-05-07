import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import crypto from 'crypto';
// import { bucket } from '../../../../config.json';
const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
import { httpStatusCode, sendResponse } from '../../../libs/api.response';
import { PRESIGNED_URL_UPLOAD_BUCKET } from '../../../utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();
// import url from 'url';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const url = require('url');

export const getSignedUrl = async (event) => {
	try {
		const { request } = event.Records[0].cf;
		const { headers } = request;
		const signedUrl = await s3.getSignedUrl('putObject', {
			Bucket: PRESIGNED_URL_UPLOAD_BUCKET,
			Key: `uploads/${crypto.randomUUID()}`
		});

		const { path } = url.parse(signedUrl);
		const host = headers.host[0].value;

		const hash = await crypto.createHash('sha512').update(path).digest('hex');

		await s3
			.putObject({
				Bucket: PRESIGNED_URL_UPLOAD_BUCKET,
				Key: `signatures/valid/${hash}`,
				Body: JSON.stringify({ created: Date.now() }),
				ContentType: 'application/json',
				ContentEncoding: 'gzip'
			})
			.promise();

		const signedURL = `https://${host}${path}`;

		return sendResponse(httpStatusCode.CREATED, {
			data: encryptData(signedURL)
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const generateSignedUrl = middyfy(getSignedUrl);
