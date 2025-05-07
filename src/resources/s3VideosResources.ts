const s3VideoResources = {
	Bucket: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			BucketName: '${self:custom.preSignedURLUploadsBucket}',
			AccelerateConfiguration: {
				AccelerationStatus: 'Enabled'
			},
			BucketEncryption: {
				ServerSideEncryptionConfiguration: [
					{
						ServerSideEncryptionByDefault: {
							SSEAlgorithm: 'AES256'
						}
					}
				]
			},
			VersioningConfiguration: {
				Status: 'Enabled'
			},
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedHeaders: ['*'],
						AllowedMethods: ['GET', 'PUT', 'POST'],
						AllowedOrigins: ['*'],
						Id: 'CORSRuleId1',
						MaxAge: '3600',
						ExposedHeaders: ['Access-Control-Allow-Origin', 'ETag']
					}
				]
			}
		}
	},
	BucketPreSignedURL: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			BucketName: '${self:custom.preSignedURLBucket}',
			PublicAccessBlockConfiguration: {
				BlockPublicAcls: true,
				BlockPublicPolicy: true,
				IgnorePublicAcls: true,
				RestrictPublicBuckets: true
			},
			BucketEncryption: {
				ServerSideEncryptionConfiguration: [
					{
						ServerSideEncryptionByDefault: {
							SSEAlgorithm: 'AES256'
						}
					}
				]
			},
			VersioningConfiguration: {
				Status: 'Enabled'
			},
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedHeaders: ['*'],
						AllowedMethods: ['GET', 'PUT'],
						AllowedOrigins: ['*'],
						Id: 'CORSRuleId1',
						MaxAge: '3600'
					}
				]
			}
		}
	},
	VideoBucket: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			BucketName: '${self:custom.videobucket}',
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedHeaders: ['*'],
						AllowedMethods: ['GET'],
						AllowedOrigins: ['*'],
						Id: 'OpenCors',
						MaxAge: '3600'
					}
				]
			}
		}
	},
	SourceBucketPolicy: {
		Type: 'AWS::S3::BucketPolicy',
		Properties: {
			Bucket: '${self:custom.videobucket}',
			PolicyDocument: {
				Statement: [
					{
						Sid: 'PolicyForCloudFrontPrivateContent',
						Effect: 'Allow',
						Principal: {
							CanonicalUser: {
								'Fn::GetAtt': 'OriginAccessIdentity.S3CanonicalUserId'
							}
						},
						Action: ['s3:GetObject'],
						Resource: ['arn:aws:s3:::${self:custom.videobucket}/output/*']
					}
				]
			}
		}
	},
	VideoInputBucket: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			BucketName: '${self:custom.videoInputBucket}',
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedHeaders: ['*'],
						AllowedMethods: ['GET'],
						AllowedOrigins: ['*'],
						Id: 'OpenCors',
						MaxAge: '3600'
					}
				]
			}
		}
	},
	VideoInputBucketPolicy: {
		Type: 'AWS::S3::BucketPolicy',
		Properties: {
			Bucket: '${self:custom.videoInputBucket}',
			PolicyDocument: {
				Statement: [
					{
						Sid: 'PolicyForCloudFrontPrivateContentInput',
						Effect: 'Allow',
						Principal: {
							CanonicalUser: {
								'Fn::GetAtt': 'OriginAccessIdentity.S3CanonicalUserId'
							}
						},
						Action: ['s3:GetObject'],
						Resource: ['arn:aws:s3:::${self:custom.videoInputBucket}/output/*']
					}
				]
			}
		}
	}
};

export default s3VideoResources;
