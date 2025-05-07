import health from '@functions/health';

import {
	adminSignup,
	adminLogin,
	forgotPassword,
	confirmPassword,
	subscriberSignup,
	verifyEmail
} from '@functions/auth';

import {
	updateUserProfile,
	updateUserDetails,
	updateUserAvatar,
	getAdminProfile,
	getUserProfile,
	deactivateSubscriber,
	getUser,
	retrieveUsers,
	sendInvite,
	deleteUserAccount,
	resendSignupEmail,
	retrieveUserInvite,
	retrieveUserInvites,
	processUserInvitesSQSMessages,
	getUserInformation,
	retrieveSubscriberAllInvoices,
	acceptInvite,
	viewAcceptedInvites,
	getDeactivatedUsers,
	searchUsers
} from '@functions/users';

import {
	createCustomer,
	retrieveCustomer,
	addSubscription,
	purchasePlan,
	cancelSubscription,
	retrieveProducts,
	retrieveProduct,
	paymentWebhook,
	retrieveSubscriptions,
	retrieveInvoices,
	getAllCharges,
	getSubscriberInvoices,
	retrieveSubscriptionsConsumer
} from '@functions/subscriptions';

import {
	addCategory,
	removeCategory,
	retrieveCategories,
	searchCategories
} from '@functions/categories';

import {
	generateSignedUrl,
	uploadVideo,
	addVideoMetadata,
	retrieveVideos,
	retrieveVideo,
	videoConverter,
	updateVideoMetadata,
	generatePreSignedUrl,
	featureVideo,
	searchVideos,
	initiateS3MultipartVideoUpload,
	createS3PresignedUploadPartsURLs,
	completeS3MultipartFileUpload,
	updateFMVideo
} from '@functions/videos';

const functions = {
	health,
	adminSignup,
	verifyEmail,
	adminLogin,
	forgotPassword,
	updateUserProfile,
	updateUserAvatar,
	updateUserDetails,
	getAdminProfile,
	getUserProfile,
	confirmPassword,
	subscriberSignup,
	createCustomer,
	retrieveCustomer,
	addSubscription,
	purchasePlan,
	cancelSubscription,
	retrieveProducts,
	retrieveProduct,
	paymentWebhook,
	retrieveSubscriptions,
	deactivateSubscriber,
	retrieveInvoices,
	getAllCharges,
	getUser,
	retrieveUsers,
	getSubscriberInvoices,
	retrieveSubscriptionsConsumer,
	sendInvite,
	deleteUserAccount,
	resendSignupEmail,
	retrieveUserInvite,
	retrieveUserInvites,
	processUserInvitesSQSMessages,
	getUserInformation,
	retrieveSubscriberAllInvoices,
	acceptInvite,
	viewAcceptedInvites,
	getDeactivatedUsers,
	addCategory,
	removeCategory,
	retrieveCategories,
	searchUsers,
	searchCategories,
	generateSignedUrl,
	uploadVideo,
	addVideoMetadata,
	retrieveVideos,
	videoConverter,
	updateVideoMetadata,
	retrieveVideo,
	generatePreSignedUrl,
	featureVideo,
	searchVideos,
	initiateS3MultipartVideoUpload,
	createS3PresignedUploadPartsURLs,
	completeS3MultipartFileUpload,
	updateFMVideo
};

export default functions;
