import type { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';

export const health = async (event: APIGatewayProxyEvent) => {
	const { resource, path, requestContext } = event;
	return formatJSONResponse({
		status: 'success',
		message: 'Welcome to 1st Man API!',
		event: { resource, path, domainName: requestContext?.domainName, apiId: requestContext?.apiId }
	});
};
