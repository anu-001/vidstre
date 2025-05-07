import handlerPath from '@libs/handler-resolver';

export const updateUserDetails = {
	handler: `${handlerPath(__dirname)}/updateUserDetails/index.updateUserDetails`,
	events: [
		{
			http: {
				method: 'post',
				path: 'user/update-details',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary:
					'Subscriber onboarding endpoint. Used to update the subscriber/end users information',
				description: '/POST endpoint user details updating',
				swaggerTags: ['Subscribers'],
				bodyType: 'UpdateUserResponse',
				responseData: {
					200: {
						description: 'User details successful updated',
						bodyType: 'UpdateUserResponse'
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

export const getAdminProfile = {
	handler: `${handlerPath(__dirname)}/retrieveUser/index.getUserProfile`,
	events: [
		{
			http: {
				method: 'get',
				path: 'admin/profile',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Retrieve Admin Profile.',
				description: '/GET endpoint used to retrieve the admins profile/record',
				swaggerTags: ['Admin'],
				responseData: {
					200: {
						description: 'User profile successful'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const updateUserProfile = {
	handler: `${handlerPath(__dirname)}/updateUser/index.updateUserProfile`,
	events: [
		{
			http: {
				method: 'post',
				path: 'user/profile-setup',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary:
					'Subscriber onboarding endpoint. Used to update the subscriber/end users profile with a username, imgURL, website & company',
				description: '/POST endpoint subscriber onboarding',
				swaggerTags: ['Subscribers'],
				bodyType: 'UpdateUserResponse',
				responseData: {
					200: {
						description: 'User profile successful',
						bodyType: 'UpdateUserResponse'
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

export const updateUserAvatar = {
	handler: `${handlerPath(__dirname)}/updateAvatar/index.updateUserAvatar`,
	events: [
		{
			http: {
				method: 'post',
				path: '/user/profile-picture',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary:
					'Subscriber onboarding endpoint. Used to update the subscriber/end users profile image and username',
				description: '/POST endpoint subscriber onboarding',
				swaggerTags: ['Subscribers'],
				bodyType: 'UpdateUserResponse',
				responseData: {
					200: {
						description: 'User profile information updated successfully',
						bodyType: 'UpdateUserResponse'
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

export const getUserProfile = {
	handler: `${handlerPath(__dirname)}/retrieveUser/index.getUserProfile`,
	events: [
		{
			http: {
				method: 'get',
				path: 'users/me',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary:
					'An endpoint that retrieves current user profile with username, picture, website, company',
				description: '/POST endpoint admin onboarding',
				swaggerTags: ['Admin'],
				bodyType: 'adminAuth',
				responseData: {
					200: {
						description: 'User profile successful',
						bodyType: 'loginResponse'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const deactivateSubscriber = {
	handler: `${handlerPath(__dirname)}/deactivateSubscriber/index.deactivateSubscriber`,
	events: [
		{
			http: {
				method: 'patch',
				path: 'users/account',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint for admin to deactivate or reactivate subscribers',
				description:
					'/PATCH endpoint that allow admin to deactivate subscribers with email, reason, description and customerId',
				swaggerTags: ['subscriptions']
			}
		}
	]
};

export const getUser = {
	handler: `${handlerPath(__dirname)}/getSubscriber/index.getUser`,
	events: [
		{
			http: {
				method: 'get',
				path: '/users/subscriber/{userId}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint for admin to get a user by email',
				description: '/POST endpoint for user details',
				swaggerTags: ['Admin'],
				bodyType: 'adminAuth',
				responseData: {
					200: {
						description: 'User retrieved successfully',
						bodyType: 'loginResponse'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const retrieveUsers = {
	handler: `${handlerPath(__dirname)}/listUsers/index.listUsers`,
	events: [
		{
			http: {
				method: 'post',
				path: 'users/{pageLimit}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to get all users details',
				description: '/GET endpoint for user details',
				swaggerTags: ['Admin'],
				bodyType: 'adminAuth',
				responseData: {
					200: {
						description: 'User retrieved successfully',
						bodyType: ''
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const sendInvite = {
	handler: `${handlerPath(__dirname)}/sendInvite/index.sendInvite`,
	events: [
		{
			http: {
				method: 'post',
				path: '/admin/send-invites',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to invite users to the platform by a super admin',
				description: '/POST for users invite. Requires first name, last name, email and role',
				swaggerTags: ['Auth'],
				bodyType: 'InviteData',
				responseData: {
					200: {
						description: 'Invite link sent to the email successfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'An invite with the given email already exists.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const deleteUserAccount = {
	handler: `${handlerPath(__dirname)}/deleteUserAccount/index.deleteUserAccount`,
	events: [
		{
			http: {
				method: 'post',
				path: 'admin/delete-user-accounts',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to delete users from the platform by a super admin',
				description: '/POST for user account delete. Requires email and role',
				swaggerTags: ['Auth'],
				bodyType: 'DeleteData',
				responseData: {
					200: {
						description: 'Accounts deleted successfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'An invite with the given email already exists.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const retrieveUserInvite = {
	handler: `${handlerPath(__dirname)}/retrieveUserInvite/index.getUserInvite`,
	events: [
		{
			http: {
				method: 'get',
				path: '/users/user-invite/{inviteId}',
				cors: true,
				summary: 'An endpoint that returns a user invite',
				description: '/GET a user invite',
				swaggerTags: ['Admin']
			}
		}
	]
};

export const getUserInformation = {
	handler: `${handlerPath(__dirname)}/getUserInformation/index.getUserInformation`,
	events: [
		{
			http: {
				method: 'get',
				path: '/users/user-information',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint for admin to get a user by email',
				description: '/Get endpoint for user details',
				swaggerTags: ['Admin'],
				bodyType: 'adminAuth',
				responseData: {
					200: {
						description: 'User retrieved successfully',
						bodyType: 'loginResponse'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const processUserInvitesSQSMessages = {
	handler: `${handlerPath(__dirname)}/processUserInvitesSQSMessages/index.processUserInvitesSQSMessages`,
	events: [
		{
			sqs: {
				arn: { "Fn::GetAtt": ['FirstManQueue', 'Arn'] },
				batchSize: 10,
				maximumConcurrency: 10
			}
		}
	]
};

export const retrieveUserInvites = {
	handler: `${handlerPath(__dirname)}/retrieveUserInvites/index.listUserInvites`,
	events: [
		{
			http: {
				method: 'get',
				path: '/users/user-invites',
				cors: true,
				summary: 'An endpoint that returns user invites',
				description: '/GET a user invites',
				swaggerTags: ['Admin']
			}
		}
	]
};

export const acceptInvite = {
	handler: `${handlerPath(__dirname)}/acceptInvite/index.acceptInvite`,
	events: [
		{
			http: {
				method: 'post',
				path: '/users/accept-invite',
				cors: true,
				summary: 'An endpoint for invite users to accept invite',
				description: '/POST endpoint tha accept email, password, and invite key',
				swaggerTags: ['Admin'],
				bodyType: 'ForgotPassword',
				responseData: {
					200: {
						description: 'Object with user and invoices'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const viewAcceptedInvites = {
	handler: `${handlerPath(__dirname)}/viewAcceptedInvites/index.viewAcceptedInvites`,
	events: [
		{
			http: {
				method: 'get',
				path: '/admin/invites',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint for admin to view accepted invites',
				description: '/GET endpoint for admin to view invited accepted list',
				swaggerTags: ['Admin'],
				bodyType: '',
				responseData: {
					200: {
						description: 'Object with list'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const retrieveSubscriberAllInvoices = {
	handler: `${handlerPath(__dirname)}/retrieveUserAllInvoices/index.retrieveSubscriberAllInvoices`,
	events: [
		{
			http: {
				method: 'post',
				path: '/users/subscription/invoices',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint for admin to retrieve a user and their invoices',
				description: '/POST endpoint that retrieves user details by email',
				swaggerTags: ['Subscriptions'],
				bodyType: 'ForgotPassword',
				responseData: {
					200: {
						description: 'Object with user and invoices'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const getDeactivatedUsers = {
	handler: `${handlerPath(__dirname)}/getDeactivatedUsers/index.getDeactivatedUsers`,
	events: [
		{
			http: {
				method: 'get',
				path: '/users/deactivated',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that returns a list of all users with a deactivated property',
				description: '/GET endpoint for deactivated users',
				swaggerTags: ['Subscribers'],
				responseData: {
					200: {
						description: 'A list of all deactivated users',
						bodyType: 'listOfDeactivatedUsers'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const searchUsers = {
	handler: `${handlerPath(__dirname)}/searchUsers/index.searchUsers`,
	events: [
		{
			http: {
				method: 'post',
				path: 'users/search/{searchTerm}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to search users',
				description: '/GET users satisfying search term',
				swaggerTags: ['Admin'],
				bodyType: 'ForgotPassword',
				responseData: {
					200: {
						description: 'Object with user and invoices'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const resendSignupEmail = {
	handler: `${handlerPath(__dirname)}/resendSignupEmail/index.resendSignupEmail`,
	events: [
		{
			http: {
				method: 'post',
				path: '/admin/resend-email',
				cors: true,
				summary: 'An endpoint to resend a signup email.',
				description: '/POST for resending signup email',
				swaggerTags: ['Auth'],
				bodyType: 'IResendEmail',
				responseData: {
					200: {
						description: 'Email has been resent successfully!',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'An invite with the given email already exists.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};
