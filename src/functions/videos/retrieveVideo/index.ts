import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { VideoRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { VIDEOS_TABLE } from '../../../utils/env';
import { encryptData } from '@libs/crypto-client';

dotenv.config();

export const getVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const admin = event?.requestContext?.authorizer?.claims?.email;
		const { videoId } = event.pathParameters;
		if (!admin) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: `Invalid credentials`
			});
		}
		const data = await Dynamo.get<VideoRecord>({
			pkKey: 'id',
			pkValue: videoId,
			tableName: VIDEOS_TABLE
		});
		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify(data))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveVideo = middyfy(getVideo);
