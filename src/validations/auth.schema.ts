export const loginInputSchema = {
	type: 'object',
	properties: {
		body: {
			type: 'object',
			properties: {
				email: { type: 'string' },
				password: { type: 'string' }
			},
			required: ['email', 'password']
		}
	}
};

export const signupInputSchema = {
	type: 'object',
	properties: {
		body: {
			type: 'object',
			properties: {
				signup: { type: 'string' }
			},
			required: ['signup']
		}
	}
};

export const passwordInputSchema = {
	type: 'object',
	properties: {
		body: {
			type: 'object',
			properties: {
				email: { type: 'string' }
			},
			required: ['userId']
		}
	}
};

export const profileInputSchema = {
	type: 'object',
	properties: {
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				imgURL: { type: 'string' },
				website: { type: 'string' },
				company: { type: 'string' }
			},
			required: []
		}
	}
};
