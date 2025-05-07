const cloudFrontResources = {
	CloudFront: {
		Type: 'AWS::CloudFront::Distribution',
		DependsOn: ['Bucket'],
		Properties: {
			DistributionConfig: {
				Enabled: true,
				Comment: '${self:provider.stage}-${self:service}',
				PriceClass: 'PriceClass_100',
				HttpVersion: 'http2',
				IPV6Enabled: true,
				ViewerCertificate: {
					CloudFrontDefaultCertificate: true
				},
				CustomErrorResponses: [
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 400
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 403
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 404
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 405
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 414
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 416
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 500
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 501
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 502
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 503
					},
					{
						ErrorCachingMinTTL: 0,
						ErrorCode: 504
					}
				],
				Origins: [
					{
						DomainName: '${self:custom.preSignedURLUploadsBucket}.s3.amazonaws.com',
						Id: 'S3Origin',
						S3OriginConfig: {}
					}
				],
				DefaultCacheBehavior: {
					TargetOriginId: 'S3Origin',
					ViewerProtocolPolicy: 'redirect-to-https',
					DefaultTTL: 0,
					MaxTTL: 0,
					MinTTL: 0,
					ForwardedValues: {
						QueryString: 'true',
						Cookies: {
							Forward: 'none'
						}
					},
					AllowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']
				},
				CacheBehaviors: [
					{
						TargetOriginId: 'S3Origin',
						ViewerProtocolPolicy: 'redirect-to-https',
						DefaultTTL: 0,
						MaxTTL: 0,
						MinTTL: 0,
						ForwardedValues: {
							QueryString: 'false',
							Cookies: {
								Forward: 'none'
							}
						},
						PathPattern: 'url',
						AllowedMethods: ['GET', 'HEAD']
					}
				]
			}
		}
	},
	OriginAccessIdentity: {
		Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
		Properties: {
			CloudFrontOriginAccessIdentityConfig: {
				Comment: 'Access private S3 bucket content only through CloudFront'
			}
		}
	},
	VideoCloudfront: {
		Type: 'AWS::CloudFront::Distribution',
		Properties: {
			DistributionConfig: {
				Origins: [
					{
						DomainName: '${self:custom.videobucket}.s3.amazonaws.com',
						Id: 'myS3Origin',
						OriginPath: '/output',
						S3OriginConfig: {
							OriginAccessIdentity: {
								'Fn::Join': [
									'',
									[
										'origin-access-identity/cloudfront/',
										{
											Ref: 'OriginAccessIdentity'
										}
									]
								]
							}
						}
					}
				],
				Enabled: 'true',
				DefaultRootObject: 'index.html',
				DefaultCacheBehavior: {
					TargetOriginId: 'myS3Origin',
					ViewerProtocolPolicy: 'allow-all',
					MinTTL: '86400',
					SmoothStreaming: 'false',
					Compress: 'true',
					ForwardedValues: {
						QueryString: 'false',
						Cookies: {
							Forward: 'none'
						},
						Headers: ['Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Origin']
					}
				},
				PriceClass: 'PriceClass_All',
				ViewerCertificate: {
					CloudFrontDefaultCertificate: 'true'
				}
			}
		}
	}
};

export default cloudFrontResources;
