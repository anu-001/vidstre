import handlerPath from '@libs/handler-resolver';

export const generateSignedUrl = {
	handler: `${handlerPath(__dirname)}/generateSignedUrl/index.generateSignedUrl`,
	events: [
		{
			http: {
				method: 'get',
				path: 'videos/old',
				cors: true,
				memorySize: 128,
				timeout: 5,
				lambdaAtEdge: {
					distribution: 'CloudFront',
					eventType: 'viewer-request',
					pathPattern: 'url'
				},
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to get signed URL to upload to S3 bucket',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				responseData: {
					200: {
						description: 'URL generated successfully'
					},
					400: {
						description: 'Bad request'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const uploadVideo = {
	handler: `${handlerPath(__dirname)}/uploadVideo/index.uploadVideo`,
	events: [
		{
			http: {
				method: 'post',
				path: 'videos/upload',
				cors: true,
				memorySize: 128,
				timeout: 5,
				lambdaAtEdge: {
					distribution: 'CloudFront',
					eventType: 'viewer-request'
				},
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to get signed URL to upload to S3 bucket',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				responseData: {
					200: {
						description: 'URL generated successfully'
					},
					400: {
						description: 'Bad request'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const addVideoMetadata = {
	handler: `${handlerPath(__dirname)}/addVideoMetadata/index.addVideoMetadata`,
	events: [
		{
			http: {
				method: 'post',
				path: 'videos',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to add video data',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				bodyType: 'UpdateUserResponse'
			}
		}
	]
};

export const retrieveVideos = {
	handler: `${handlerPath(__dirname)}/retrieveVideos/index.retrieveVideos`,
	events: [
		{
			http: {
				method: 'post',
				path: 'list-videos/{pageLimit}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to retrieve all videos',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				bodyType: 'UpdateUserResponse'
			}
		}
	]
};

export const retrieveVideo = {
	handler: `${handlerPath(__dirname)}/retrieveVideo/index.retrieveVideo`,
	events: [
		{
			http: {
				method: 'get',
				path: 'videos/{videoId}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to retrieve all videos',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				bodyType: 'UpdateUserResponse'
			}
		}
	]
};

export const videoConverter = {
	handler: `${handlerPath(__dirname)}/videoConverter/index.videoConverter`,
	events: [
		{
			s3: {
				bucket: '${self:custom.videoInputBucket}',
				event: 's3:ObjectCreated:*',
				rule: { prefix: 'input' },
				existing: true,
				forceDeploy: true
			}
		}
	]
};

export const updateVideoMetadata = {
	handler: `${handlerPath(__dirname)}/updateVideoMetadata/index.updateVideoMetadata`,
	events: [
		{
			sns: {
				arn: { Ref: 'NotificationTopic' },
				topicName: 'NotificationTopic'
			}
		}
	]
};

export const generatePreSignedUrl = {
	handler: `${handlerPath(__dirname)}/generatePreSignedUrl/index.generatePreSignedUrl`,
	events: [
		{
			http: {
				method: 'get',
				path: 'videos/url',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'Endpoint to get signed URL to upload to S3 bucket',
				description: '/POST endpoint for admin onboarding',
				swaggerTags: ['Videos'],
				responseData: {
					200: {
						description: 'URL generated successfully'
					},
					400: {
						description: 'Bad request'
					},
					500: {
						description: 'Internal server error.'
					}
				}
			}
		}
	]
};

export const featureVideo = {
	handler: `${handlerPath(__dirname)}/featureVideo/index.featureVideo`,
	events: [
		{
			http: {
				method: 'put',
				path: '/videos/feature-video',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to make a video featured',
				description: '/POST setting a video in the database featured',
				swaggerTags: ['Admin'],
				bodyType: 'IFeaturedVideo',
				responseData: {
					200: {
						description: 'Video has been featured successfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const searchVideos = {
	handler: `${handlerPath(__dirname)}/searchVideos/index.searchVideos`,
	events: [
		{
			http: {
				method: 'post',
				path: 'videos/search/{searchTerm}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint to search videos',
				description: '/GET videos satisfying search term',
				swaggerTags: ['Admin'],
				bodyType: 'IMultipartS3Upload',
				responseData: {
					200: {
						description: 'Multipart video upload successfully initiated.',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const initiateS3MultipartVideoUpload = {
	handler: `${handlerPath(__dirname)}/initiateS3MultipartVideoUpload/index.initiateS3MultipartVideoUpload`,
	events: [
		{
			http: {
				method: 'post',
				path: '/videos/initiate-multipart-video-upload',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that initiates S3 multipart video upload',
				description: '/POST create an S3 uploadid for large video multipart upload',
				swaggerTags: ['Admin'],
				bodyType: 'IMultipartS3Upload',
				responseData: {
					200: {
						description: 'Multipart video upload successfully initiated.',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const createS3PresignedUploadPartsURLs = {
	handler: `${handlerPath(__dirname)}/createS3PresignedUploadPartsURLs/index.createS3PresignedUploadPartsURLs`,
	events: [
		{
			http: {
				method: 'post',
				path: '/videos/create-multipart-presigned-urls',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that generate a list of multi upload presigned urls',
				description: '/POST create a list of S3 presigned urls',
				swaggerTags: ['Admin'],
				bodyType: 'IMultipartS3Upload',
				responseData: {
					200: {
						description: 'Multipart presigned urls created successfully!.',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const completeS3MultipartFileUpload = {
	handler: `${handlerPath(__dirname)}/completeS3MultipartFileUpload/index.completeS3MultipartFileUpload`,
	events: [
		{
			http: {
				method: 'post',
				path: '/videos/complete-multipart-upload',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that finalizes the multipart video upload',
				description: '/POST create finalization of the multipart video upload',
				swaggerTags: ['Admin'],
				bodyType: 'IMultipartS3Upload',
				responseData: {
					200: {
						description: 'Multipart video/file uploaded successfully!.',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'UserAlreadyExists'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};

export const updateFMVideo = {
	handler: `${handlerPath(__dirname)}/updateFMVideo/index.updateFMVideo`,
	events: [
		{
			http: {
				method: 'put',
				path: '/videos/{videoId}',
				cors: true,
				authorizer: {
					name: 'PrivateAuthorizer',
					type: 'COGNITO_USER_POOLS',
					arn: {
						'Fn::GetAtt': ['UserPool', 'Arn']
					},
					claims: ['email']
				},
				summary: 'An endpoint that updates video meta but not the actual video file',
				description: '/PUT to update video metadata',
				swaggerTags: ['Admin'],
				bodyType: 'IFeaturedVideo',
				responseData: {
					200: {
						description: 'Video metadata updated successfully',
						bodyType: 'MessageResponse'
					},
					400: {
						description: 'Bad request, check if sent correct data.',
						bodyType: 'IFeaturedVideo'
					},
					500: {
						description: 'Internal server errors'
					}
				}
			}
		}
	]
};