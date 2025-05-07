type Timestamp = number;

export type SubscriptionStatus = 'active' | 'incomplete' | 'canceled' | 'invalid' | 'inactive' | 'resource_missing';
export type SubscriptionType = 'monthly' | 'lifelong';
type UserId = string;
type Subscription = string;
type Duraton = string;
export type Role = 'superadmin' | 'admin' | 'consumer';
type InviteEmail = string;
type InviteeEmail = string;
type Username = string;
type Email = string;
type CategoryName = string;

export type VideoRecord = {
	id: string;
	pk: string;
	sk: `${CategoryName}#${Timestamp}${Email}`;
	thumbnail?: string;
	category: string;
	title: string;
	description: string;
	streamingUrl?: string;
	signedUrl: string;
	filename: string;
	likes: number;
	dislikes: number;
	views: number;
	tags?: string;
	filesize?: string;
	fileInput?: string;
	conversionLog?: string;
	conversionStatus?: string;
	dateCreated: Timestamp;
	dateCreatedISO?: string;
	dateUpdated?: Timestamp;
	createdBy?: string;
	creatorName: string;
	creatorImgURL: string;
	creatorEmail: string;
	creatorRole: string;
	featured?: boolean;
	updatedBy?: string;
	purchaseId?: string;
};

export interface UsersRecord {
	id: UserId;
	pk: string;
	sk: string;
	// sk: `${Username}#${Timestamp}`;

	username: Username;
	email: string;
	dateOfBirth: string;
	firstName?: string;
	lastName?: string;
	website?: string;
	customerId?: string;
	subscriptionId?: string;
	subscriptionType?: SubscriptionType;
	subscriptionStatus?: SubscriptionStatus;
	subscriptionCancellationDate?: Timestamp;
	paymentIntentId?: string;
	purchaseStatus?: string;
	company?: string;
	customerId?: string;
	imgURL?: string;
	isDeactivated?: string;
	deactivationInfo?: {
		reason: string;
		description?: string;
	}[];
	role: Role;
	dateCreated: Timestamp;
	dateCreatedISO?: string,
	dateUpdated?: Timestamp;
	lastLoggedIn?: Timestamp;
	status?: string;
	isEmailVerified?: boolean;
	updatedBy?: string;
	hasPaidSubscription?: boolean;
}

export interface PlanRecord {
	id: string;
	pk: string;
	sk: `${Subscription}#${Duration}`;

	subscription: string;
	duration: string;
	description: string;
	amount: string;
	caps: number;
	priceId: string;
}

export interface InviteRecord {
	id: string;
	pk: string;
	sk: `${InviteeEmail}#${InviteKey}`;

	id: string;
	firstName: string;
	lastName: string;
	email: InviteeEmail;
	role: string;
	inviteKey: InviteKey;
	status: string;
	dateCreated: Timestamp;
	dateUpdated?: Timestamp;
	subscription?: string;
	hasPaid?: boolean;
	invitedBy?: string;
}

export interface CategoriesRecord {
	id: string;
	pk: string;
	sk: `${CategoryName}#${Timestamp}`;

	categoryName: string;
	description: string;
	numberOfvideos: number;
	likes: number;
	dislikes: number;
	views: number;
	tags?: {}[];
	dateCreated: Timestamp;
	dateUpdated?: Timestamp;
	createdBy: string;
	videos: VideoRecord[];
}
