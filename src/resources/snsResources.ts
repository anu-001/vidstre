const snsResources = {
	TopicCloudwatchAlarm: {
		Type: 'AWS::SNS::Topic',
		Properties: {
			TopicName: '${sls:stage}-${self:service}-cloudwatch-alarm'
		}
	},
	TopicCloudwatchAlarmSubscription: {
		Type: 'AWS::SNS::Subscription',
		Properties: {
			Endpoint: 'alerts@email.com',
			Protocol: 'email',
			TopicArn: {
				Ref: 'TopicCloudwatchAlarm'
			}
		}
	},
	NotificationTopic: {
		Type: 'AWS::SNS::Topic'
	},
	NotificationEventRule: {
		Type: 'AWS::Events::Rule',
		Properties: {
			Description: 'Report status as event to SNS topic',
			State: 'ENABLED',
			EventPattern: {
				source: ['aws.mediaconvert']
			},
			Targets: [
				{
					Arn: { Ref: 'NotificationTopic' },
					Id: 'NotificationTopic'
				}
			]
		}
	},
	NotificationTopicPolicy: {
		Type: 'AWS::SNS::TopicPolicy',
		Properties: {
			PolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'AllowCloudWatchEvents',
						Effect: 'Allow',
						Principal: {
							Service: 'events.amazonaws.com'
						},
						Action: 'sns:Publish',
						Resource: '*'
					}
				]
			},
			Topics: [{ Ref: 'NotificationTopic' }]
		}
	}
};

export default snsResources;
