const sqsResources = {
	FirstManQueue: {
		Type: 'AWS::SQS::Queue',
		Properties: {
			QueueName: '${sls:stage}-${self:service}-firstman-queue'
		}
	}
};
export default sqsResources;