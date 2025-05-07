/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import DynamoResources from 'src/resources/dynamoResources';
import s3Resources from 'src/resources/s3Resources';
import cloudwatchResources from 'src/resources/cloudwatchResources';
import snsResources from 'src/resources/snsResources';
import CognitoResources from 'src/resources/cognitoResources';
import s3VideoResources from 'src/resources/s3VideosResources';
import CloudFrontResources from 'src/resources/cloudfrontResources';
import mediaResources from 'src/resources/mediaResources';
import functions from '@functions/index';
import sqsResources from 'src/resources/sqsResources';

const serverlessConfiguration: AWS = {
	service: 'api-1st-man',
	frameworkVersion: '3',
	plugins: [
		'serverless-auto-swagger',
		'serverless-esbuild',
		'serverless-offline',
		'serverless-dynamodb-local',
		'serverless-prune-plugin',
		'serverless-domain-manager',
		'serverless-dynamodb-seed',
		'@silvermine/serverless-plugin-cloudfront-lambda-edge'
	],
	useDotenv: true,
	functions: {
		...functions
	},
	package: { individually: true },
	custom: {
		eventBridgeBusName: 'authEventBus',
		config: '${file(./config.json)}',
		bucket: 'firstman-user-images-${self:provider.stage}',
		videobucket: '${sls:stage}-${self:service}-video-output',
		videoInputBucket: '${sls:stage}-${self:service}-video-input',
		imageBucket: '${sls:stage}-${self:service}-images',
		preSignedURLBucket: '${sls:stage}-${self:service}-pre-signed-url',
		preSignedURLUploadsBucket: '${sls:stage}-${self:service}-presigned-url-uploads',
		tables: {
			usersTable: '${sls:stage}-${self:service}-user-table',
			invitesTable: '${sls:stage}-${self:service}-invite-table',
			plansTable: '${sls:stage}-${self:service}-plan-table',
			categoriesTable: '${sls:stage}-${self:service}-category-table',
			videosTable: '${sls:stage}-${self:service}-video-metadata-table'
		},
		clientOrigins: {
			dev: 'https://dev-1st-man.com',
			test: 'https://test-1st-man.com',
			prod: 'https://prod-1st-man.com'
		},
		domain: {
			dev: 'api.dev-1st-man.com',
			test: 'api.test-1st-man.com',
			prod: 'api.prod-1st-man.com'
		},
		customDomain: {
			domainName: "${self:custom.domain.${opt:stage, 'dev'}}",
			basePath: 'v1',
			stage: '${self:provider.stage}',
			createRoute53Record: true,
			createRoute53IPv6Record: true,
			endpointType: 'REGIONAL',
			securityPolicy: 'tls_1_2'
		},
		'serverless-offline': {
			noPrependStageInUrl: true
		},
		prune: {
			automatic: true,
			number: '1'
		},
		autoswagger: {
			title: '1st Man API documentations ',
			apiType: 'http',
			useStage: 'true',
			typefiles: ['./src/types/api.types.d.ts', './src/types/stripes.types.d.ts'],
			excludeStages: ['production']
		},
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node16',
			define: { 'require.resolve': undefined },
			platform: 'node',
			concurrency: 10
		},
		dynamodb: {
			stages: ['dev'],
			start: {
				port: 9990,
				inMemory: true,
				migrate: true,
				seed: true
			},
			stage: '${self:provider.stage}'
		},
		profile: {
			dev: 'serverlessDev',
			test: 'UAT-serverlessUser',
			prod: 'prod-serverlessUser'
		},
		seed: {
			plansSeed: {
				table: '${self:custom.tables.plansTable}',
				sources: ['./src/seed/plans.json']
			}
		}
	},
	provider: {
		name: 'aws',
		region: 'eu-west-1',
		runtime: 'nodejs16.x',
		stage: "${opt:stage, 'dev'}",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
			binaryMediaTypes: ['multipart/form-data'],
			apiKeys: [{ name: '${self:service}-${sls:stage}', description: 'api key' }]
		},
		environment: {
			NODE_ENV: '${env:NODE_ENV}',
			DEBUG: '*',
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			region: '${self:provider.region}',
			ACCESS_KEY_ID: '${env:ACCESS_KEY_ID}',
			SECRET_ACCESS_KEY: '${env:SECRET_ACCESS_KEY}',
			DEV_CLIENT_URL: '${self:custom.clientOrigins.dev}',
			TEST_CLIENT_URL: '${self:custom.clientOrigins.test}',
			PROD_CLIENT_URL: '${self:custom.clientOrigins.prod}',
			SQS_QUEUE_URL: '${env:SQS_QUEUE_URL}',
			SQS_MESSAGE_DELAY: '${env:SQS_MESSAGE_DELAY}',
			PRESIGNED_URL_EXPIRE_TIME: '${env:PRESIGNED_URL_EXPIRE_TIME}',
			// USER_POOL_ID: '${env:USER_POOL_ID}',
			// CLIENT_ID: '${env:CLIENT_ID}',
			USER_POOL_ID: { Ref: 'UserPool' },
			CLIENT_ID: { Ref: 'UserClient' },
			STRIPE_SECRET_KEY: '${env:STRIPE_SECRET_KEY}',
			STRIPE_WEBHOOK_SECRET: '${env:STRIPE_WEBHOOK_SECRET}',
			SOURCE_EMAIL: '${env:SOURCE_EMAIL}',
			REPLY_TO_ADDRESS: '${env:REPLY_TO_ADDRESS}',
			CLIENT_BASE_URL: '${env:CLIENT_BASE_URL}',
			ENCRYPTION_SECRET_KEY: '${env:ENCRYPTION_SECRET_KEY}',
			REGION: '${env:REGION}',
			IS_OFFLINE: '${env:IS_OFFLINE}',
			eventBridgeBusName: '${self:custom.eventBridgeBusName}',
			usersTable: '${self:custom.tables.usersTable}',
			invitesTable: '${self:custom.tables.invitesTable}',
			categoriesTable: '${self:custom.tables.categoriesTable}',
			plansTable: '${self:custom.tables.plansTable}',
			videosTable: '${self:custom.tables.videosTable}',
			PRE_SIGNED_URL_BUCKET: '${self:custom.preSignedURLBucket}',
			VIDEO_BUCKET: '${self:custom.videobucket}',
			VIDEO_INPUT_DEST_BUCKET: '${self:custom.videoInputBucket}',
			IMAGE_BUCKET: '${self:custom.imageBucket}',
			PRESIGNED_URL_UPLOAD_BUCKET: '${self:custom.preSignedURLUploadsBucket}',
			MEDIA_CONVERT_ROLE: { 'Fn::GetAtt': ['MediaConvertJobRole', 'Arn'] },
			CLOUDFRONT_DOMAIN: {
				'Fn::GetAtt': ['VideoCloudfront', 'DomainName']
			}
		},
		tracing: {
			lambda: true
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: [
							'cloudformation:DescribeStackResource',
							'cognito-idp:*',
							'cognito-idp:AdminUpdateUserAttributes',
							'cognito-idp:AdminInitiateAuth',
							'cognito-idp:AdminCreateUser',
							'cognito-idp:AdminSetUserPassword',
							'lambda:InvokeFunction',
							'dynamodb:DescribeTable',
							'dynamodb:Query',
							'dynamodb:Scan',
							'dynamodb:GetItem',
							'dynamodb:PutItem',
							'dynamodb:UpdateItem',
							'dynamodb:DeleteItem',
							'xray:PutTraceSegments',
							'xray:PutTelemetryRecords',
							's3:*',
							'ses:SendEmail',
							'ses:SendRawEmail',
							'logs:CreateLogGroup',
							'logs:CreateLogStream',
							'logs:PutLogEvents',
							'ssm:*',
							'sns:*',
							'sqs:*',
							'mediaconvert:*',
							'iam:PassRole'
						],
						Resource: [
							'*',
							'arn:aws:s3:::${self:custom.preSignedURLUploadsBucket}',
							'arn:aws:s3:::${self:custom.preSignedURLUploadsBucket}/*',
							'arn:aws:s3:::${self:custom.videobucket}',
							'arn:aws:s3:::${self:custom.videobucket}/*',
							'arn:aws:s3:::${self:custom.videoInputBucket}',
							'arn:aws:s3:::${self:custom.videoInputBucket}/*',
							{
								'Fn::GetAtt': ['MediaConvertJobRole', 'Arn']
							}
						]
					}
				]
			}
		}
	},
	resources: {
		Resources: {
			...CognitoResources,
			...DynamoResources,
			...s3Resources,
			...s3VideoResources,
			...mediaResources,
			...CloudFrontResources,
			...snsResources,
			...sqsResources,
			...cloudwatchResources
		},
		Outputs: {
			userDynamoTableName: {
				Value: '${self:custom.tables.usersTable}',
				Export: {
					Name: '${sls:stage}-UsersDynamoTableName'
				}
			},
			inviteDynamoTableName: {
				Value: '${self:custom.tables.invitesTable}',
				Export: {
					Name: '${sls:stage}-InvitesDynamoTableName'
				}
			},
			planDynamoTableName: {
				Value: '${self:custom.tables.plansTable}',
				Export: {
					Name: '${sls:stage}-PlansDynamoTableName'
				}
			},
			categoryDynamoTableName: {
				Value: '${self:custom.tables.categoriesTable}',
				Export: {
					Name: '${sls:stage}-CategoriesDynamoTableName'
				}
			},
			videoDynamoTableName: {
				Value: '${self:custom.tables.videosTable}',
				Export: {
					Name: '${sls:stage}-VideosDynamoTableName'
				}
			},
			UserPoolId: {
				Value: { Ref: 'UserPool' },
				Export: {
					Name: '${sls:stage}-${self:service}-user-pool-id'
				}
			}
		}
	}
};

module.exports = serverlessConfiguration;
