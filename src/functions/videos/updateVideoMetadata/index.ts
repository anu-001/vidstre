/* eslint-disable no-console */
import dotenv from 'dotenv';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
export { VIDEOS_TABLE } from '../../../utils/env';
import Dynamo from '@libs/Dynamo';
import { VIDEOS_TABLE, CLIENT_BASE_URL } from '../../../utils/env';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';
import { VideoRecord } from 'src/types/dynamo';

dotenv.config();

export const updateVideo = async (event) => {
	try {
		const data = JSON.parse(event.Records[0].Sns.Message);
		const videoId = data.detail.userMetadata.videoId;
		await Dynamo.updateVideoStatus({
			tableName: VIDEOS_TABLE,
			pkKey: 'id',
			pkValue: videoId,
			updateValue: data.detail.status.toLowerCase()
		});
		if (data.detail.status === 'COMPLETE') {
			const existingVideo = await Dynamo.get<VideoRecord>({
				pkKey: 'id',
				pkValue: videoId,
				tableName: VIDEOS_TABLE
			});

			await sendMail(
				existingVideo.creatorEmail,
				emailConfig.processedVideoSubject,
				emailConfig.processedVideoNotificationBody(
					existingVideo.creatorName,
					existingVideo.title,
					`${CLIENT_BASE_URL}/watch-content/video/${existingVideo.id}`,
					existingVideo.category
				)
			);
		}

		return sendResponse(httpStatusCode.OK, {
			message: 'Success'
		});
	} catch (error) {
		console.log('error-updatevideMD', error);
		return sendResponse(error?.statusCode, { message: error?.message, code: error?.code });
	}
};

export const updateVideoMetadata = updateVideo;
