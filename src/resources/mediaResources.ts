const mediaResources = {
	MediaConvertJobRole: {
		Type: 'AWS::IAM::Role',
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: {
					Effect: 'Allow',
					Principal: {
						Service: ['mediaconvert.amazonaws.com', 'mediaconvert.eu-west-1.amazonaws.com']
					},
					Action: ['sts:AssumeRole']
				}
			},
			Path: '/',
			Policies: [
				{
					PolicyName: 'MediaConvertJobRolePolicy',
					PolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Action: ['s3:*', 'sns:*', 'logs:*', 'cloudwatch:*', 'autoscaling:Describe*'],
								Resource: '*'
							}
						]
					}
				}
			]
		}
	}
};

export default mediaResources;
