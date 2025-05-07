import AWS from 'aws-sdk';
import emailConfig from './emailConfig';

const SES = new AWS.SES();
const source = emailConfig.source;

const sendMail = async (destination: string, subject: string, body: string) => {
	const params = {
		Destination: {
			ToAddresses: [destination]
		},
		Message: {
			Body: {
				Html: { Data: body }
			},
			Subject: {
				Data: subject
			}
		},
		Source: source
	};

	try {
		return await SES.sendEmail(params).promise();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log('SES Error', error);
		return error.message;
	}
};

export default sendMail;
