export interface IStripeCustomer {
	id: string;
	object: string;
	address?: any;
	balance: number;
	created: number;
	currency: string;
	default_source?: any;
	delinquent: boolean;
	description: string;
	discount?: any;
	email?: any;
	invoice_prefix: string;
	invoice_settings: IStripeInvoiceSettings;
	livemode: boolean;
	metadata: any;
	name?: any;
	next_invoice_sequence: number;
	phone?: any;
	preferred_locales: any[];
	shipping?: any;
	sources: IStripeSources;
	subscriptions: IStripeSubscriptions;
	tax_exempt: string;
	tax_ids: IStripeTaxIds;
}

export interface IStripeInvoiceSettings {
	custom_fields?: any;
	default_payment_method?: any;
	footer?: any;
}

export interface IStripeSources {
	object: string;
	data: any[];
	has_more: boolean;
	url: string;
}

export interface IStripeSubscriptions {
	object: string;
	data: any[];
	has_more: boolean;
	url: string;
}

export interface IStripeTaxIds {
	object: string;
	data: any[];
	has_more: boolean;
	url: string;
}

export interface IStripeSubscription {
	id: string;
	object: string;
	application_fee_percent?: any;
	billing_cycle_anchor: number;
	billing_thresholds?: any;
	cancel_at?: any;
	cancel_at_period_end: boolean;
	canceled_at?: any;
	collection_method: string;
	created: number;
	current_period_end: number;
	current_period_start: number;
	customer: string;
	days_until_due?: any;
	default_payment_method?: any;
	default_source?: any;
	default_tax_rates: any[];
	discount?: any;
	ended_at?: any;
	items: IStripeItems;
	latest_invoice?: any;
	livemode: boolean;
	metadata: any;
	next_pending_invoice_item_invoice?: any;
	pause_collection?: any;
	pending_invoice_item_interval?: any;
	pending_setup_intent?: any;
	pending_update?: any;
	quantity: number;
	schedule?: any;
	start_date: number;
	status: string;
	tax_percent?: any;
	trial_end?: any;
	trial_start?: any;
}

export interface IStripeRecurring {
	aggregate_usage?: any;
	interval: string;
	interval_count: number;
	trial_period_days: number;
	usage_type: string;
}

export interface IStripePrice {
	id: string;
	object: string;
	active: boolean;
	billing_scheme: string;
	created: number;
	currency: string;
	livemode: boolean;
	lookup_key?: any;
	metadata: any;
	nickname: string;
	product: string;
	recurring: IStripeRecurring;
	tiers?: any;
	tiers_mode?: any;
	transform_quantity?: any;
	type: string;
	unit_amount: number;
	unit_amount_decimal: string;
}

export interface IStripeDatum {
	id: string;
	object: string;
	billing_thresholds?: any;
	created: number;
	metadata: any;
	price: IStripePrice;
	quantity: number;
	subscription: string;
	tax_rates: any[];
}

export interface IStripeItems {
	object: string;
	data: IStripeDatum[];
	has_more: boolean;
	url: string;
}
