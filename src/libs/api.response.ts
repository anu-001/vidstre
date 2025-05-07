export const httpStatusCode = {
	CREATED: 201,
	OK: 200,
	BAD_REQUEST: 400,
	CONFLICT: 409,
	NOT_FOUND: 404,
	INTERNAL_SERVER: 500,
	FORBIDDEN: 403
};

export const sendResponse = (
	statusCode: number,
	body: { message?: string | any; token?: string; code?: string; data?: any }
) => {
	return {
		isBase64Encoded: false,
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true
		},
		body: JSON.stringify(body)
	};
};
