import dotenv from 'dotenv';
import { MediaConvertClient } from '@aws-sdk/client-mediaconvert';
import { CLIENT_BASE_URL, REGION } from '../../utils/env';

dotenv.config();

const ENDPOINT = {
	endpoint: `${CLIENT_BASE_URL}.mediaconvert.${REGION}.amazonaws.com`
};

const emcClient = new MediaConvertClient(ENDPOINT);
export { emcClient };
