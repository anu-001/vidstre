import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { CategoriesRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { CATEGORIES_TABLE } from 'src/utils/env';
import { utilFilter } from 'src/utils/utils';

dotenv.config();

export const getCategories = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const limit = Number(event?.queryStringParameters?.limit) || 10;
		const likes = Number(event.queryStringParameters?.likes);
		const dislikes = Number(event.queryStringParameters?.dislikes);
		const numberOfvideos = Number(event.queryStringParameters?.numberOfvideos);
		const filters: { likes?: number; dislikes?: number; numberOfvideos?: number } = {};
		if (likes) {
			filters['likes'] = likes;
		}
		if (dislikes) {
			filters['dislikes'] = dislikes;
		}
		if (numberOfvideos) {
			filters['numberOfvideos'] = numberOfvideos;
		}

		const userResponse = await Dynamo.scan<CategoriesRecord>(CATEGORIES_TABLE);
		const filteredRes = utilFilter(userResponse, filters);
		const categories = filteredRes.slice(0, limit);

		return sendResponse(httpStatusCode.OK, {
			data: { categories }
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const retrieveCategories = middyfy(getCategories);
