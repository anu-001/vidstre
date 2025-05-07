import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { Authorizer } from '../types/api.types';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
	body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
	ValidatedAPIGatewayProxyEvent<S>,
	APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
	return {
		statusCode: 200,
		body: JSON.stringify(response)
	};
};

export const corsSettings = {
	headers: [
		// Specify allowed headers
		'Content-Type',
		'X-Amz-Date',
		'Authorization',
		'X-Api-Key',
		'X-Amz-Security-Token',
		'X-Amz-User-Agent'
	],
	allowCredentials: false
};

export const authorizer: Authorizer = {
	name: 'PrivateAuthorizer',
	type: 'COGNITO_USER_POOLS',
	arn: { 'Fn::GetAtt': ['UserPool', 'Arn'] },
	claims: ['email']
};
