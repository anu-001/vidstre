import handlerPath from '@libs/handler-resolver';

export const createCustomer = {
	handler: `${handlerPath(__dirname)}/createCustomerStripe/index.createCustomer`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/create-customer',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to create customer on Stripe to track payment and subscriptions',
				description: '/POST Create customer with the email and username on Stripe API',
				swaggerTags: ['Subscriptions']
			}
		}
	]
};

export const retrieveCustomer = {
	handler: `${handlerPath(__dirname)}/retrieveCustomer/index.retrieveCustomer`,
	events: [
		{
			http: {
				method: 'get',
				path: 'subscriptions/customer/{customerId}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint retrieve an existing customers details from Stripe',
				description: '/GET Retrieve a Stripe customer object for a given customer id',
				swaggerTags: ['Subscriptions'],
				bodyType: '',
				responseData: {
					200: {
						description: 'Stripe customer object'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

export const addSubscription = {
	handler: `${handlerPath(__dirname)}/createSubscription/index.createCustomerSubscription`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/create-subscription',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that creates subscription for an existing customer',
				description: '/POST Create customer subscription with priceId and customerId',
				swaggerTags: ['Subscriptions']
			}
		}
	]
};

export const purchasePlan = {
	handler: `${handlerPath(__dirname)}/createPaymentIntent/index.createPaymentIntent`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/purchase-plan',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that purchases a plan',
				description: '/POST Create customer purchase',
				swaggerTags: ['Subscriptions']
			}
		}
	]
};

export const retrieveProducts = {
	handler: `${handlerPath(__dirname)}/retrieveProducts/index.getProducts`,
	events: [
		{
			http: {
				method: 'get',
				path: 'subscriptions',
				cors: true,
				summary: 'An endpoint that retrieve products that has been created on Stripe dashboard',
				description:
					'/GET endpoint that returns existing product details on Stripe, products are needed for prices',
				swaggerTags: ['Subscriptions']
			}
		}
	]
};

export const retrieveProduct = {
	handler: `${handlerPath(__dirname)}/retrieveProductById/index.getProduct`,
	events: [
		{
			http: {
				method: 'get',
				path: 'subscriptions/product/{productId}',
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
					'An endpoint that retrieve an existing product that has been created on Stripe dashboard',
				description:
					'/GET endpoint that returns an existing product detail on Stripe, products are needed for prices',
				swaggerTags: ['Subscriptions']
			}
		}
	]
};

export const cancelSubscription = {
	handler: `${handlerPath(__dirname)}/cancelSubscription/index.cancelSubscription`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/cancel',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to cancel customer subscription',
				swaggerTags: ['Subscriptions'],
				description:
					'/POST endpoint that cancel customer subscriptions, this pauses the next subscription of the customer '
			}
		}
	]
};

export const retrieveSubscriptions = {
	handler: `${handlerPath(__dirname)}/retrieveSubscriptions/index.retrieveAllSubscriptions`,
	events: [
		{
			http: {
				method: 'get',
				path: 'subscriptions/all',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'End point to retrieve all subscriptions',
				description: '/Get request for all charges related to a stripe payment intent',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'Returns a Stripe Subscriptions Object'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

export const retrieveSubscriptionsConsumer = {
	handler: `${handlerPath(__dirname)}/retrieveSubscriptions/index.retrieveAllSubscriptions`,
	events: [
		{
			http: {
				method: 'get',
				path: 'subscriptions/customers/all',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'End point to return, be default, a list of all active subscriptions',
				description: '/Get request for all active subscriptions',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'By default, returns a list of subscriptions that have not been canceled'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

export const retrySubInvoice = {
	handler: `${handlerPath(__dirname)}/index.retrySubcriptionInvoice`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/retry',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				}
			}
		}
	]
};

export const paymentWebhook = {
	handler: `${handlerPath(__dirname)}/stripeWebhook/index.paymentWebhook`,
	events: [
		{
			http: {
				method: 'post',
				path: 'stripe/webhooks',
				cors: true,
				summary:
					'Stripe webhook endpoints that trigger events based on the data objects from Stripe payments endpoints',
				description: '/POST request for Stripe invoice, payments etc events',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'A successful message -  "Webhook event successful!"',
						bodyType: 'IStripeCustomer'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

export const getAllCharges = {
	handler: `${handlerPath(__dirname)}/returnAllCharges/index.getAllCharges`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/all-charges',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'End point to retrieve all charges for a specific stripe payment intent',
				description: '/Get request for all charges related to a stripe payment intent',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'The response data',
						bodyType: 'StripeChargesResponse'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

export const retrieveInvoices = {
	handler: `${handlerPath(__dirname)}/retrieveStripeInvoices/index.retrieveInvoices`,
	events: [
		{
			http: {
				method: 'get',
				path: 'invoices/all',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'End point that returns a list of all Stripe invoices',
				description: '/Get request for the list of invoices',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'Stripe Invoice Object'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};

// getSubscriberInvoices
export const getSubscriberInvoices = {
	handler: `${handlerPath(__dirname)}/retrieveSubscriberInvoices/index.getSubscriberInvoices`,
	events: [
		{
			http: {
				method: 'post',
				path: 'subscriptions/customer/invoices',
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
					'End point that returns a list of all Stripe invoices for a specific customer using their Stripe CustomerId',
				description: '/POST request for the list of invoices associated to a specific user',
				swaggerTags: ['Subscriptions'],
				responseData: {
					200: {
						description: 'A object with a data property that contains an array invoice attachments'
					},
					500: {
						description: 'Internal server error'
					}
				}
			}
		}
	]
};
