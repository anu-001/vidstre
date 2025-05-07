/* eslint-disable no-console */
import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { videoConfig } from '../../../../config.json';
const { MEDIA_CONVERT_ROLE, CLOUDFRONT_DOMAIN, VIDEO_BUCKET } = process.env;
import { CLIENT_BASE_URL, VIDEOS_TABLE } from 'src/utils/env';
import Dynamo from '@libs/Dynamo';
import { sendResponse } from '@libs/api.response';
import { VideoRecord } from 'src/types/dynamo';
import { videoEmailNotifier } from 'src/utils/utils';

dotenv.config();

const mediaconvert = new AWS.MediaConvert({ apiVersion: '2017-08-29' });

const mediaConverter = async (event) => {
	try {
		const bucket = event.Records[0].s3.bucket.name;
		const key = event.Records[0].s3.object.key;
		console.log('bucket-key', key);
		const existingVideo = await retrieveVideo(key.split('_')[1].split('.')[0]);
		console.log('existingVideo', existingVideo);
		const videoId = existingVideo.id;
		const job = await createJob(event, videoId);
		console.log('job-converter', job, 'df-domain', CLOUDFRONT_DOMAIN);
		const data: VideoRecord = {
			...existingVideo,
			conversionStatus: 'created',
			streamingUrl: `https://${CLOUDFRONT_DOMAIN}/${videoId}.m3u8`
		};

		mediaconvert.endpoint = videoConfig.MEDIA_CONVERT_API;
		const queue = await mediaconvert.getQueue({ Name: 'Default' }).promise();
		job.Queue = queue.Queue.Arn;

		try {
			const result = await mediaconvert.createJob(job).promise();
			console.log('Job created! ', result);
			data.fileInput = 's3://' + bucket + '/' + key;
			data.filename = key;
			data.conversionLog = JSON.stringify({ result });
		} catch (error) {
			data.conversionStatus = 'failed';
			data.conversionLog = error.toString();
			console.log('media-converter-job', error);
		}

		await addVideoMetadata(data);
		console.log('Converson successfully completed!');

		return sendResponse(201, {
			message: 'converson successfully completed!'
		});
	} catch (err) {
		console.error('media-err', err);
	}
};

const addVideoMetadata = async (data: VideoRecord) => {
	const result = await Dynamo.write({
		tableName: VIDEOS_TABLE,
		data: { ...data }
	});
	console.log('DB-video-write', result);
	// processed video email
	const watchLink = `${CLIENT_BASE_URL}/watch-content/video/${result.id}`;

	await videoEmailNotifier(result.creatorEmail, result.creatorName, watchLink, result.title);
};

const retrieveVideo = async (videoId: string) => {
	return await Dynamo.get({
		pkKey: 'id',
		pkValue: videoId,
		tableName: VIDEOS_TABLE
	});
};

const createJob = async (event, videoId) => {
	try {
		const bucket = event.Records[0].s3.bucket.name;
		const key = event.Records[0].s3.object.key;
		console.log('MEDIA_CONVERT_ROLE', MEDIA_CONVERT_ROLE);

		const output = {
			Name: 'HLS',
			Outputs: Object.entries(videoConfig.outputProfiles).map(([NameModifier, Preset]) => ({
				Preset,
				NameModifier
			})),
			OutputGroupSettings: {
				Type: 'HLS_GROUP_SETTINGS',
				HlsGroupSettings: {
					Destination: `s3://${VIDEO_BUCKET}/output/${videoId}`,
					...videoConfig.hlsSettings
				}
			}
		};

		const jobResult = {
			Queue: '',
			Role: MEDIA_CONVERT_ROLE,
			Settings: {
				OutputGroups: [output],
				AdAvailOffset: 0,
				Inputs: [
					{
						FileInput: 's3://' + bucket + '/' + key,
						...videoConfig.inputSettings
					}
				],
				TimecodeConfig: {
					Source: 'EMBEDDED'
				}
			},
			UserMetadata: {
				videoId
			}
		};
		return jobResult;
	} catch (error) {
		console.error('createJob-error', error);
	}
};

export const videoConverter = mediaConverter;
