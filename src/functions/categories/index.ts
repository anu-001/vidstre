import handlerPath from '@libs/handler-resolver';

export const addCategory = {
	handler: `${handlerPath(__dirname)}/addCategory/index.addCategory`,
	events: [
		{
			http: {
				method: 'post',
				path: 'categories',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to add or update an existing category',
				description: '/POST Add category for videos',
				swaggerTags: ['Categories']
			}
		}
	]
};

export const removeCategory = {
	handler: `${handlerPath(__dirname)}/removeCategory/index.removeCategory`,
	events: [
		{
			http: {
				method: 'delete',
				path: 'categories/{categoryName}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint remove an existing category',
				description: '/DELETE remove category for videos',
				swaggerTags: ['Categories']
			}
		}
	]
};

export const retrieveCategories = {
	handler: `${handlerPath(__dirname)}/retrieveCategories/index.retrieveCategories`,
	events: [
		{
			http: {
				method: 'get',
				path: 'categories',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that returns all existing categories',
				description: '/GET all categories',
				swaggerTags: ['Categories']
			}
		}
	]
};

export const searchCategories = {
	handler: `${handlerPath(__dirname)}/searchCategories/index.searchCategories`,
	events: [
		{
			http: {
				method: 'post',
				path: 'categories/search',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to search categories',
				description: '/GET all categories',
				swaggerTags: ['Categories']
			}
		}
	]
};
