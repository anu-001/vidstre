export interface AdminSignupBody {
	email: string;
	password: string;
}

export interface MessageResponse {
	message: string;
}

export interface UserAlreadyExists {
	message: string;
	code: string;
}

interface AuthTokens {
	AccessToken: string;
	ExpiresIn: number;
	TokenType: string;
	RefreshToken: string;
	IdToken: string;
}

export interface LoginResponse {
	token: AuthTokens;
}

export interface UpdateUserResponse {
	username: string;
	imgURL?: string;
	website?: string;
	company?: string;
}

export interface IncorrectCredentials {
	message: string;
	code: string;
}

export interface ForgotPassword {
	email: string;
}

export interface ForgotPasswordResponse {
	message: {
		CodeDeliveryDetails: {
			Destination: string;
			DeliveryMedium: string;
			AttributeName: string;
		};
	};
}

export interface AdminResetPasswordBody {
	email: string;
	newPassword: string;
	confirmationCode: string;
}

export interface SubscriberSignUpBody {
	email: string;
	password: string;
	dateOfBirth: string;
}

interface SubscriptionPlan {
	planId: string;
	subscription: string;
	amount: number;
	description: string;
	duration: string;
	caps?: number;
	currency: string;
}
export interface SubscriptionPlans {
	message: SubscriptionPlan[];
}

export interface SubscriberSignUpResponse {
	message: string;
	token: AuthTokens;
}

type StripeCharge = {
	amount: number;
	status: string;
	id: string;
	payment_intent: string;
	payment_method: string;
	paid: boolean;
	failure_message: string;
};
export interface StripeChargesResponse {
	charges: {
		data: StripeCharge[];
		has_more: boolean;
		object: string;
		url: string;
	};
}

export interface IInviteUser {
	firstName: string,
	lastName: string,
	email: string,
	role: string,
	subscription?: string,
	hasPaid?: boolean
}

export interface InviteData {
	userinvites: IInviteUser[]
}

export interface DeleteData {
	deleteData: { email: string }[]
}

export type CognitoUserAttributes = {
	Name: string;
	Value: string;
};

export interface CognitoUser {
	Username: string;
	Attributes: CognitoUserAttributes[];
	UserCreateDate: string;
	UserLastModifiedDate: string;
	Enabled: string;
	UserStatus: string;
}

export type listOfDeactivatedUsers = {
	data: CognitoUser;
};

export interface Authorizer {
	name: string;
	type: string;
	arn: {
		'Fn::GetAtt': string[];
	};
	claims: any[];
}

export interface IResendEmail {
	email: string;
}

export interface IFeaturedVideo {
	id: string;
	featured: boolean;
}

export interface IMultipartS3Upload {
	title: string;
	description: string
	file: Blob
}
