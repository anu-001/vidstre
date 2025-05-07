/* eslint-disable no-loops/no-loops */
import Busboy from 'busboy';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CognitoUser, CognitoUserAttributes } from 'src/types/api.types';
import sendMail from '@libs/sendMail';
import emailConfig from '@libs/emailConfig';

export interface UploadedFile {
	filename: string;
	contentType: string;
	encoding: string;
	content: Buffer | string;
}

export interface FormData {
	file?: UploadedFile;
	fields: Record<string, any>;
}

/**
 * Parses the multipart form data and returns the uploaded files and fields
 */
export const parseFormData = async (event: APIGatewayProxyEvent): Promise<FormData> =>
	new Promise((resolve, reject) => {
		const busboy = Busboy({
			headers: { 'content-type': event.headers['Content-Type'] || event.headers['content-type'] }
		});

		const fields: Record<string, any> = {};

		let uploadedFile: UploadedFile;

		// event listener for the form data
		busboy.on('file', (field, file, filename, encoding, contentType) => {
			let content = '';

			file.on('data', (data) => {
				// reads the file content in one chunk
				content = data;
			});

			file.on('error', reject);

			file.on('end', () => {
				uploadedFile = {
					filename,
					encoding,
					contentType,
					content
				};
			});
		});

		busboy.on('field', (fieldName, value) => {
			fields[fieldName] = value;
		});

		busboy.on('error', reject);

		busboy.on('finish', () => {
			resolve({ file: uploadedFile, fields });
		});

		busboy.write(event.body || '', event.isBase64Encoded ? 'base64' : 'binary');
		busboy.end();
	});

export const extractAmount = (string: string) => parseInt(string.replace(/[^0-9]/g, ''));

export const transformResult = (data: any) => {
	for (let i = 0; i < data.length; i++) {
		const attrs = data[i].Attributes;

		for (let j = 0; j < attrs.length; j++) {
			data[i][`${attrs[j].Name}`] = attrs[j].Value;
		}
		delete data[i].Attributes;
	}
	return data;
};

export const transformUserAttributes = (user: any) => {
	const userAttr = user.UserAttributes;
	for (let i = 0; i < userAttr.length; i++) {
		user[`${userAttr[i].Name}`] = userAttr[i].Value;
	}
	delete user.UserAttributes;
	return user;
};

export const extractDeactivatedUsers = (data: any) => {
	const listOfDeactivatedUsers = [] as CognitoUser[];

	data?.map((userObject: CognitoUser) => {
		let isDeactivated;
		userObject.Attributes?.map((attribute: CognitoUserAttributes) => {
			if (attribute.Name === 'custom:isDeactivated' && attribute.Value === 'true') {
				return (isDeactivated = true);
			}
			return;
		});

		if (isDeactivated) listOfDeactivatedUsers.push(userObject);
		return;
	});

	return listOfDeactivatedUsers;
};

export const utilFilter = (arr, filters) => {
	const filterKeys = Object.keys(filters);
	return arr.filter((item) => {
		return filterKeys.every((key) => !!~String(item[key]).indexOf(filters[key]));
	});
};

export const videoEmailNotifier = async (
	email: string,
	username: string,
	link: string,
	videoTitle: string
) => {
	sendMail(
		email,
		emailConfig.processedVideoSubject,
		emailConfig.processedVideoBody(username, link, videoTitle)
	);
};
