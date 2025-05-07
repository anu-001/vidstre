import dotenv from 'dotenv';
import middyfy from '@libs/middyfy';
import { sendResponse, httpStatusCode } from '../../../libs/api.response';
import { APIGatewayProxyResult } from 'aws-lambda';
import { CategoriesRecord } from 'src/types/dynamo';
import Dynamo from '@libs/Dynamo';
import { randomUUID } from 'crypto';
import { CATEGORIES_TABLE } from 'src/utils/env';

dotenv.config();

export const createCategory = async (
	event: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
	try {
		const { categoryName, description } = event.body;
		const email = event.requestContext.authorizer.claims.email;

		const category = await Dynamo.get<CategoriesRecord>({
			pkKey: 'categoryName',
			pkValue: categoryName,
			tableName: CATEGORIES_TABLE
		});

		const timestamp = Date.now();
		let categoryRecord: CategoriesRecord;
		if (!category) {
			categoryRecord = {
				id: randomUUID(),
				pk: categoryName,
				sk: `${categoryName}#${timestamp}`,
				categoryName,
				description,
				numberOfvideos: 0,
				likes: 0,
				dislikes: 0,
				views: 0,
				createdBy: email,
				dateCreated: timestamp
			};
		} else {
			categoryRecord = {
				id: category.id,
				pk: category.categoryName,
				sk: `${category.categoryName}#${category.dateCreated}`,
				categoryName: categoryName || category.categoryName,
				description: description || category.description,
				numberOfvideos: category.numberOfvideos,
				likes: category.likes,
				dislikes: category.dislikes,
				views: category.views,
				createdBy: category.createdBy,
				dateCreated: category.dateCreated,
				dateUpdated: timestamp
			};
		}

		const data = await Dynamo.write({
			tableName: CATEGORIES_TABLE,
			data: { ...categoryRecord }
		});

		return sendResponse(httpStatusCode.OK, {
			data
		});
	} catch (error) {
		return sendResponse(error.statusCode, { message: error.message, code: error.code });
	}
};

export const addCategory = middyfy(createCategory);
