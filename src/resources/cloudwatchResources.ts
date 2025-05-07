const cloudwatchResources = {
	ApiGatewayAlarm5xx: {
		Type: 'AWS::CloudWatch::Alarm',
		Properties: {
			AlarmDescription: '5xx errors detected at API Gateway',
			Namespace: 'AWS/ApiGateway',
			MetricName: '5XXError',
			Statistic: 'Sum',
			Threshold: '0',
			ComparisonOperator: 'GreaterThanThreshold',
			EvaluationPeriods: '1',
			Period: '60'
		}
	}
};

export default cloudwatchResources;
