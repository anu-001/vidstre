import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { CategoriesRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { CATEGORIES_TABLE } from 'src/utils/env';

dotenv.config();

export const deleteCategory = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { categoryName } = event.pathParameters;
		const category = await Dynamo.delete<CategoriesRecord>({
			pkKey: 'categoryName',
			pkValue: categoryName,
			tableName: CATEGORIES_TABLE
		});

		if (!category) {
			return sendResponse(httpStatusCode.NOT_FOUND, {
				message: 'Category does not exist'
			});
		}
		return sendResponse(httpStatusCode.OK, {
			message: `${categoryName} Category removed successfully!`
		});
	} catch (error) {
		if (error['$metadata'].httpStatusCode == 400) {
			return sendResponse(httpStatusCode.BAD_REQUEST, {
				message: 'Category does not exist'
			});
		}
		return sendResponse(error['$metadata'].httpStatusCode, {
			message: error.message,
			code: error['$metadata'].httpStatusCode
		});
	}
};

export const removeCategory = middyfy(deleteCategory);
