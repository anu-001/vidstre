import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { getCognitoUserByEmail } from '../../../libs/cognito';
import { UsersRecord, VideoRecord } from 'src/types/dynamo';
import { USERS_TABLE, VIDEOS_TABLE } from 'src/utils/env';
import Dynamo from '@libs/Dynamo';
import { decryptData, encryptData } from '@libs/crypto-client';

dotenv.config();

export const makeVideoFeatured: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { featuredVideo } = event.body;
		const { id, featured } = JSON.parse(decryptData(featuredVideo))

		const email = event.requestContext.authorizer.claims.email;
		const response = await getCognitoUserByEmail(email);
		const updatedBy = await Dynamo.get<UsersRecord>({
			pkKey: 'id',
			pkValue: response.sub,
			tableName: USERS_TABLE
		});

		const video = await Dynamo.get<VideoRecord>({
			pkKey: 'id',
			pkValue: id,
			tableName: VIDEOS_TABLE
		});

		const staredVideo = await Dynamo.write({
			tableName: VIDEOS_TABLE,
			data: {
				...video,
				featured,
				updatedBy: `${updatedBy.firstName} ${updatedBy.lastName}`,
				dateUpdated: Date.now()
			}
		});

		return sendResponse(httpStatusCode.OK, {
			data: encryptData(JSON.stringify({ featuredVideo: staredVideo }))
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const featureVideo = middyfy(makeVideoFeatured);
