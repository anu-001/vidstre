import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';

const middyfy = (handler) => {
	return middy(handler)
		.use(middyJsonBodyParser())
		.use(httpErrorHandler())
		.use(cors())
		.use(errorLogger());
};

export default middyfy;
