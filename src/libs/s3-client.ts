import { S3Client, CreateMultipartUploadCommand, PutObjectCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IMAGE_BUCKET, PRESIGNED_URL_EXPIRE_TIME, REGION } from "src/utils/env";

const s3 = new S3Client({});

export const uploadImageToS3 = async (bucket, key, body, contentType) => {
	const params = {
		ACL: "public-read",
		Bucket: bucket,
		Key: key,
		Body: body,
		ContentType: contentType
	};
	const command = new PutObjectCommand(params)
	await s3.send(command);
	return {
		Location: `https://${IMAGE_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`
	}
};

export const createS3MultipartUpload = async (
	bucket: string,
	key: string
) => {
	const params = {
		Bucket: bucket,
		Key: key
	};
	const command = new CreateMultipartUploadCommand(params)
	const multipartupload = await s3.send(command);

	return multipartupload
};

export const generateS3UploadPresignedUrls = async (
	bucket: string,
	key: string,
	uploadId: string,
	numberOfParts: number
) => {
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadId
	};

	const promises = []

	for (let index = 0; index < numberOfParts; index++) {
			const command = new UploadPartCommand({
					...params,
					PartNumber: index + 1,
			});
			promises.push(
					getSignedUrl(s3, command, { expiresIn: parseInt(PRESIGNED_URL_EXPIRE_TIME ?? '1800') }),
			)
	}

	const signedUrls = await Promise.all(promises)

	return signedUrls.map((signedUrl, index) => {
			return {
					signedUrl: signedUrl,
					partNumber: index + 1,
			}
	})
}

export const completeS3MultipartUpload = async (
	bucket: string,
	key: string,
	uploadId: string,
	parts: {
		etag: string,
		partNumber: number
	}[]
) => {
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadId,
		MultipartUpload: {
			Parts: parts
				.map((part) => {
					return {
						ETag: part.etag,
						PartNumber: part.partNumber
					}
				})
		}
	};
	const command = new CompleteMultipartUploadCommand(params)
	return await s3.send(command)
}