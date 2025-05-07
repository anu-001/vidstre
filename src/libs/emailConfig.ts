import {
	adminSignup,
	passwordLink,
	userRegistration,
	passwordChanged,
	successfulPaymentBody,
	failedPaymentBody,
	deletedSubscriptionBody,
	accountDeactivationBody,
	accountReactivationBody,
	inviteBody,
	processedVideoBody,
	videoNotificationBody,
	processedVideoNotificationBody
} from './email.bodies';
import dotenv from 'dotenv';

dotenv.config();

import { SOURCE_EMAIL, REPLY_TO_ADDRESS } from '../utils/env';

const emailConfig = {
	source: `Kris from 1STMAN <${SOURCE_EMAIL}>`,
	replyToAddresses: REPLY_TO_ADDRESS,
	bccEmailAddress: [],
	ccAddresses: [],
	adminSignupSubject: 'Welcome aboard to 1STMAN!',
	userSignupSubject: 'Welcome aboard to 1STMAN!',
	passwordReset: 'Locked out?',
	passwordUpdated: '1st Man Password changed',
	successfulPaymentSubject: 'Payment Successful',
	failedPaymentSubject: 'Payment Unsuccessful',
	deletedSubscriptionSubject: '1st Man: Subscription Suspended',
	accountDeactivationSubject: '1st Man: Account Suspended',
	accountReactivationSubject: '1st Man: Account Restored',
	inviteSubject: 'Your exclusive 1STMAN invitation',
	processedVideoSubject: 'Video Ready for Streaming!',
	videoNotificationSubject: 'Video Uploaded',
	adminSignup,
	passwordLink,
	passwordChanged,
	userRegistration,
	successfulPaymentBody,
	failedPaymentBody,
	deletedSubscriptionBody,
	accountDeactivationBody,
	accountReactivationBody,
	inviteBody,
	processedVideoBody,
	videoNotificationBody,
	processedVideoNotificationBody
};

export default emailConfig;
