import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { CategoriesRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { CATEGORIES_TABLE } from 'src/utils/env';

dotenv.config();

/**
 * This is temporary implementation
 * This will be implemented with
 * AWS Elastic Search, AWS Kinesis
 * for a better user experience
 */
export const searchCategory = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const limit = Number(event?.body?.limit) || 10;
		const text = event?.body?.searchText;
		const userResponse = await Dynamo.scan<CategoriesRecord>(CATEGORIES_TABLE);
		if (text && text.name) {
			// eslint-disable-next-line prettier/prettier
			const result = userResponse.filter((item) =>
				item.categoryName.toLocaleLowerCase().includes(text.name.toLowerCase())
			);
			const categories = result.slice(0, limit);
			return sendResponse(httpStatusCode.OK, {
				data: { categories }
			});
		}
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const searchCategories = middyfy(searchCategory);
