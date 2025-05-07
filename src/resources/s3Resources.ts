const s3Resources = {
	FirstManUsersBucketUpload: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			BucketName: '${sls:stage}-${self:service}-images',
			AccessControl: 'PublicRead',
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedMethods: ['GET', 'HEAD', 'POST', 'PUT'],
						AllowedOrigins: ['*']
					}
				]
			}
		}
	},
	UploadFilePolicy: {
		Type: 'AWS::IAM::Policy',
		Properties: {
			PolicyName: 'UploadObjects',
			PolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'LambdaPutObjects',
						Effect: 'Allow',
						Action: ['s3:PutObject', 's3:PutObjectTagging', 's3:PutObjectAcl', 's3:GetObjectAcl'],
						Resource: 'arn:aws:s3:::${sls:stage}-${self:service}-images/*',
						Condition: {
							StringEquals: {
								's3:x-amz-acl': 'bucket-owner-full-control'
							}
						}
					}
				]
			},
			Roles: ['serverless-s3-role-eu-west-1']
		}
	}
};
export default s3Resources;
