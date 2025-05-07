import dotenv from 'dotenv';
import { getCognitoUserByEmail } from '@libs/cognito';
import emailConfig from '@libs/emailConfig';
import sendMail from '@libs/sendMail';
import Dynamo from './Dynamo';
import { UsersRecord } from 'src/types/dynamo';
import { STRIPE_SECRET_KEY, USERS_TABLE } from 'src/utils/env';

dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(STRIPE_SECRET_KEY);

/**
 * Products describe the specific goods or services you offer to your customers.
 * For example, you might offer a Standard and Premium version of your goods or service;
 * each version would be a separate Product. They can be used in conjunction with Prices
 * to configure pricing in Payment Links, Checkout, and Subscriptions.
 *
 */
export const listProducts = async () => {
	return await stripe.products.list({ expand: ['data.default_price'] });
};

export const retrieveProduct = async (productId: string) => {
	return await stripe.products.retrieve(productId);
};

/** 
 * This object represents a customer of  1st Man. 
It lets you create recurring charges and track payments that belong to the same customer. https://stripe.com/docs/api/customers
**/
export const createStripeCustomer = async (email: string, name: string) => {
	return await stripe.customers.create({ email, name });
};

/**
 * This object retrieve a customer of  1st Man
 **/
export const retrieveStripeCustomer = async (customerId: string) => {
	return await stripe.customers.retrieve(customerId);
};

/**
 * This object retrieve a customer of  1st Man
 **/
export const retrieveStripeCustomerSubscriptions = async (customerId: string) => {
	return await stripe.customers.retrieve(customerId, { expand: ['subscriptions'] });
};

/**
 * This object retrieve a customer invoices from Stripe customer
 **/
export const retrieveStripeCustomerInvoices = async (customerId: string, limit: number) => {
	return await stripe.invoices.list({ customer: customerId, limit: limit });
};

export const createStripeSubscription = async (customerId: string, priceId: string) => {
	return await stripe.subscriptions.create({
		customer: customerId,
		items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		payment_behavior: 'default_incomplete',
		expand: ['latest_invoice.payment_intent']
	});
};

export const retrieveStripePrice = async (priceId: string) => {
	return await stripe.prices.retrieve(priceId);
};

export const createStripePaymentIntent = async (
	customerId: string,
	priceId: string,
	email: string
) => {
	const { unit_amount, currency } = await retrieveStripePrice(priceId);

	return await stripe.paymentIntents.create({
		customer: customerId,
		amount: unit_amount,
		currency: currency,
		receipt_email: email,
		payment_method_types: ['card'],
		statement_descriptor: '1ST Man transaction'
	});
};

export const retrieveStripePaymentIntent = async (paymentntentId: string) => {
	return await stripe.paymentIntents.retrieve(paymentntentId);
};

export const cancelStripeSubscription = async (subscriptionId: string) => {
	return await stripe.subscriptions.del(subscriptionId);
};

export const updateStripeSubscription = async (subscriptionId: string, items: any[]) => {
	return await stripe.subscriptions.update(subscriptionId, {
		cancel_at_period_end: false,
		proration_behavior: 'create_prorations',
		items: items
	});
};

export const retrieveStripeSubscription = async (subscriptionId: string) => {
	return await stripe.subscriptions.retrieve(subscriptionId);
};

export const retrieveStripeSubscriptions = async (limit: number) => {
	return await stripe.subscriptions.list({ limit: limit });
};

export const listInvoices = async (limit: number) => {
	return await stripe.invoices.list({ limit: limit });
};

const customerDataObject = async (dataObject: any) => {
	const customerID = dataObject['customer'] as string;
	if (!customerID) {
		throw Error(`No customer with ID "${customerID}"`);
	}
	const customer: any = {};
	customer.customerEmail = dataObject['customer_email'] as string;
	customer.customerName = dataObject['customer_name'] as string;
	customer.linkToInvoice = dataObject['hosted_invoice_url'] as string;
	return customer;
};

const paymentSucceeded = async (dataObject: any) => {
	const customer = await customerDataObject(dataObject);
	const subscriptionType = dataObject.lines.data[0];
	await updateUserRecord(customer.customerEmail, subscriptionType.plan.interval, 'active');
	await sendMail(
		customer.customerEmail,
		emailConfig.successfulPaymentSubject,
		emailConfig.successfulPaymentBody(customer.customerName, customer.linkToInvoice)
	);
};

const paymentFailed = async (dataObject: any) => {
	const customer = await customerDataObject(dataObject);
	const subscriptionType = dataObject.lines.data[0];
	updateUserRecord(customer.customerEmail, subscriptionType.plan.interval, dataObject.status);
	await sendMail(
		customer.customerEmail,
		emailConfig.failedPaymentSubject,
		emailConfig.failedPaymentBody(customer.customerName, customer.linkToInvoice)
	);
};

const subscriptionDeleted = async (dataObject: any) => {
	const customer = await customerDataObject(dataObject);
	updateUserRecord(customer.customerEmail, dataObject.plan.interval, dataObject.status);
	await sendMail(
		customer.customerEmail,
		emailConfig.deletedSubscriptionSubject,
		emailConfig.deletedSubscriptionBody(customer.customerName, customer.linkToInvoice)
	);
};

const oneOffPaymentSucceeded = async (dataObject: any) => {
	const payeeEmail = dataObject?.receipt_email;
	const receiptURL = dataObject?.charges?.data[0].receipt_url;
	await updateUserRecord(payeeEmail, 'one-off', 'active');
	await sendMail(
		payeeEmail,
		emailConfig.successfulPaymentSubject,
		emailConfig.successfulPaymentBody(payeeEmail, receiptURL)
	);
};

const oneOffPaymentFailed = async (dataObject: any) => {
	const payeeEmail = dataObject?.receipt_email;
	const receiptURL = dataObject?.charges?.data[0].receipt_url;
	await updateUserRecord(payeeEmail, 'one-off', 'inactive');
	await sendMail(
		payeeEmail,
		emailConfig.failedPaymentSubject,
		emailConfig.failedPaymentBody(payeeEmail, receiptURL)
	);
};

export const webhookHandlerMapping: { [key: string]: Function } = {
	'invoice.payment_succeeded': paymentSucceeded,
	'invoice.payment_failed': paymentFailed,
	'customer.subscription.deleted': subscriptionDeleted,
	'payment_intent.succeeded': oneOffPaymentSucceeded,
	'payment_intent.payment_failed': oneOffPaymentFailed
};

export const retrieveListOfStripeCharges = async (paymentIntentId: string) => {
	return await stripe.charges.list({
		payment_intent: paymentIntentId
	});
};

export const updateUserRecord = async (
	email: string,
	subscriptionType: any,
	subscriptionStatus: any
) => {
	const usersTableName = process.env.usersTable;
	const cognitoUser = await getCognitoUserByEmail(email);
	const user = await Dynamo.get<UsersRecord>({
		pkKey: 'id',
		pkValue: cognitoUser.sub,
		tableName: USERS_TABLE
	})
	const timestamp = Date.now();
	const updatedUserRecord: UsersRecord = {
		...user,
		subscriptionType,
		subscriptionStatus,
		dateUpdated: timestamp
	};

	await Dynamo.write({
		tableName: usersTableName,
		data: { ...updatedUserRecord }
	});
};
