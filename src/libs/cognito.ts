import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { USER_POOL_ID, CLIENT_ID } from 'src/utils/env';
import { transformUserAttributes } from 'src/utils/utils';
const cognito = new AWS.CognitoIdentityServiceProvider();

dotenv.config();

export const adminConfirmSignUp = async ({
	userpoolId,
	username
}: {
	userpoolId: string;
	username: string;
}) => {
	const params = {
		UserPoolId: userpoolId,
		Username: username
	};
	return cognito.adminConfirmSignUp(params).promise();
};

export const getCognitoUserByEmail = async (email: string) => {
	const params = { UserPoolId: USER_POOL_ID, Username: email };
	const cognitoUser = await cognito.adminGetUser(params).promise();
	return transformUserAttributes(cognitoUser)
};

export const updateUserAttributes = async ({
	attributes,
	email
}: {
	attributes: any[];
	email: string;
}) => {
	const params = {
		UserAttributes: attributes,
		UserPoolId: USER_POOL_ID,
		Username: email
	};
	return await cognito.adminUpdateUserAttributes(params).promise();
};

export const adminCreateUser = async (params) => {
	return await cognito.adminCreateUser(params).promise();
};

export const adminDeleteUser = async (params) => {
	return await cognito.adminDeleteUser(params).promise();
};

export const setPassword = async ({ email, password }: { email: string; password: string }) => {
	const paramsForSetPass = {
		Password: password,
		UserPoolId: USER_POOL_ID,
		Username: email,
		Permanent: true
	};
	return await cognito.adminSetUserPassword(paramsForSetPass).promise();
};

export const initiateAuth = async ({ email, password }: { email: string; password: string }) => {
	const params = {
		AuthFlow: 'ADMIN_NO_SRP_AUTH',
		UserPoolId: USER_POOL_ID,
		ClientId: CLIENT_ID,
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password
		}
	};

	return await cognito.adminInitiateAuth(params).promise();
};
