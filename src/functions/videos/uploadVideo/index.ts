import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import crypto from 'crypto';
// import { bucket } from '../../../../config.json';
const s3 = new AWS.S3({ region: 'eu-west-1' });
import { PRESIGNED_URL_UPLOAD_BUCKET } from '../../../utils/env';

dotenv.config();

const forbiddenResponse = {
	status: '403',
	statusDescription: 'Forbidden',
	headers: {
		'content-type': [
			{
				key: 'Content-Type',
				value: 'text/plain'
			}
		],
		'content-encoding': [
			{
				key: 'Content-Encoding',
				value: 'UTF-8'
			}
		]
	},
	body: 'Forbidden'
};
async function headSignature({ type, hash }) {
	const key = `signatures/${type}/${hash}`;
	try {
		await s3
			.headObject({
				Bucket: PRESIGNED_URL_UPLOAD_BUCKET,
				Key: key
			})
			.promise();
		return true;
	} catch (error) {
		return false;
	}
}

const upload = async (event) => {
	try {
		const { request } = event.Records[0].cf;
		const { querystring, uri, method } = request;

		if (method !== 'PUT') {
			return forbiddenResponse;
		}

		const hash = crypto.createHash('sha512').update(`${uri}?${querystring}`).digest('hex');

		const [validSignature, expiredSignature] = await Promise.all([
			headSignature({ type: 'valid', hash }),
			headSignature({ type: 'expired', hash })
		]);

		if (!validSignature || expiredSignature) {
			return forbiddenResponse;
		}

		const { VersionId: version } = await s3
			.putObject({
				Bucket: PRESIGNED_URL_UPLOAD_BUCKET,
				Key: `signatures/expired/${hash}`,
				Body: JSON.stringify({ created: Date.now() }),
				ContentType: 'application/json',
				ContentEncoding: 'gzip'
			})
			.promise();

		const { Versions: versions } = await s3
			.listObjectVersions({
				Bucket: PRESIGNED_URL_UPLOAD_BUCKET,
				Prefix: `signatures/expired/${hash}`
			})
			.promise();

		const sortedVersions = versions.concat().sort((a, b) => {
			return a?.LastModified > b?.LastModified;
		});

		if (sortedVersions.length > 1 && sortedVersions[0].VersionId !== version) {
			return forbiddenResponse;
		}

		return request;
	} catch (error) {
		console.error(error);
	}
};

export const uploadVideo = upload;
