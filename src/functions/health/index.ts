import handlerPath from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.health`,
	events: [
		{
			http: {
				method: 'get',
				path: '/health',
				summary: 'Test Endpoint. Checks if server is running',
				description: '/Get request for server health',
				swaggerTags: ['Server'],
				responseData: {
					200: {
						description: 'Server is up and running!'
					},
					500: {
						description: 'Internal server error, server is down!'
					}
				}
			}
		}
	]
};
