const CognitoResources = {
	UserPool: {
		Type: 'AWS::Cognito::UserPool',
		Properties: {
			UserPoolName: '${self:provider.stage}-user-pool',
			Policies: {
				PasswordPolicy: {
					MinimumLength: 8,
					RequireLowercase: true,
					RequireNumbers: true,
					RequireSymbols: true,
					RequireUppercase: true,
					TemporaryPasswordValidityDays: 14
				}
			},
			AutoVerifiedAttributes: ['email'],
			UsernameAttributes: ['email']
		}
	},
	UserClient: {
		Type: 'AWS::Cognito::UserPoolClient',
		Properties: {
			ClientName: '${self:provider.stage}-user-pool-client',
			GenerateSecret: false,
			UserPoolId: {
				Ref: 'UserPool'
			},
			ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH']
		}
	}
};
export default CognitoResources;
