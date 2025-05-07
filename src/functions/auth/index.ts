import handlerPath from '@libs/handler-resolver';

export const adminSignup = {
	handler: `${handlerPath(__dirname)}/adminSignup/index.adminSignup`,
	events: [
		{
			http: {
				method: 'post',
				path: 'auth/admin/signup',
				cors: true,
				summary: 'Admin Signup Endpoint',
				description: '/POST used to signup admins. Requires email and password',
				swaggerTags: ['Admin'],
				bodyType: 'AdminAuth',
				responseData: {
					200: {
						description: 'User registration successful',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'An account with the given email already exists.',
						bodyType: 'UserAlreadyExists'
					}
				}
			}
		}
	]
};

export const adminLogin = {
	handler: `${handlerPath(__dirname)}/login/index.login`,
	events: [
		{
			http: {
				method: 'post',
				path: 'auth/admin/login',
				cors: true,
				summary: 'Admin Login Endpoint',
				description:
					'/POST used to login as an admin user. Requires email and password and returns a token',
				swaggerTags: ['Admin'],
				bodyType: 'AdminAuth',
				responseData: {
					200: {
						description: 'User registration successful',
						bodyType: 'LoginResponse'
					},
					400: {
						description: 'Incorrect username or password',
						bodyType: 'IncorrectCredentials'
					}
				}
			}
		}
	]
};

export const forgotPassword = {
	handler: `${handlerPath(__dirname)}/forgotPassword/index.authForgotPassword`,
	events: [
		{
			http: {
				method: 'post',
				path: '/auth/forgot-password',
				cors: true,
				summary:
					'Admin Forgot Password Endpoint. Requires admin email and returns an account recovery confirmation code',
				description: '/POST request for user in User Pools to ask for confirmation code',
				swaggerTags: ['Admin'],
				bodyType: 'ForgotPassword',
				responseData: {
					200: {
						description: 'Confirmation code sent to the users email inbox successfully',
						bodyType: 'ForgotPasswordResponse'
					},
					400: {
						description: 'User email is invalid'
						// implement bodyType once api is fully operational
					}
				}
			}
		}
	]
};

export const confirmPassword = {
	handler: `${handlerPath(__dirname)}/confirmPassword/index.confirmPassword`,
	events: [
		{
			http: {
				method: 'post',
				path: '/auth/reset-password',
				cors: true,
				summary: 'Admin password reset endpoint.',
				description:
					'/POST request used to validate the confirmation code sent by the admin user. Returns a message response.',
				swaggerTags: ['Admin'],
				bodyType: 'AdminResetPasswordBody',
				responseData: {
					200: {
						description: 'Valid email, confirmation, code and new password set successfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Request exceptions for clients - bad request'
					}
				}
			}
		}
	]
};

export const subscriberSignup = {
	handler: `${handlerPath(__dirname)}/subscriberSignup/index.subscriberSignup`,
	events: [
		{
			http: {
				method: 'post',
				path: '/auth/users/signup',
				cors: true,
				summary: 'Subscriber signup endpoint.',
				description: '/POST request used to signup subscribers (endusers)',
				swaggerTags: ['Subscribers'],
				bodyType: 'SubscriberSignUpBody',
				responseData: {
					200: {
						description: 'User registration successful',
						bodyType: 'SubscriberSignUpResponse'
					},
					400: {
						description: 'An account with the given email already exists.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'an internal server error has occurred'
					}
				}
			}
		}
	]
};

export const verifyEmail = {
	handler: `${handlerPath(__dirname)}/verifyEmail/index.verifyEmail`,
	events: [
		{
			http: {
				method: 'post',
				path: 'auth/verify-email',
				cors: true,
				summary: 'Email verification endpoint. Used to verify user email',
				description: '/POST endpoint verifying user email',
				swaggerTags: ['Admin'],
				bodyType: 'UpdateUserResponse',
				responseData: {
					200: {
						description: 'User email verified succssfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request',
						bodyType: 'MessageResponse'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};
