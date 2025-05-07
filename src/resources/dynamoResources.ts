const DynamoResources = {
	UsersTable: {
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			TableName: '${self:custom.tables.usersTable}',
			AttributeDefinitions: [
				{
					AttributeName: 'id',
					AttributeType: 'S'
				},
				{
					AttributeName: 'pk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'sk',
					AttributeType: 'S'
				}
			],

			KeySchema: [
				{
					AttributeName: 'id',
					KeyType: 'HASH'
				}
			],
			BillingMode: 'PAY_PER_REQUEST',
			GlobalSecondaryIndexes: [
				{
					IndexName: 'index1',
					KeySchema: [
						{
							AttributeName: 'pk',
							KeyType: 'HASH'
						},
						{
							AttributeName: 'sk',
							KeyType: 'RANGE'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			]
		}
	},
	PlansTable: {
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			TableName: '${self:custom.tables.plansTable}',
			AttributeDefinitions: [
				{
					AttributeName: 'id',
					AttributeType: 'S'
				},
				{
					AttributeName: 'pk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'sk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'username',
					AttributeType: 'S'
				}
			],

			KeySchema: [
				{
					AttributeName: 'id',
					KeyType: 'HASH'
				}
			],
			BillingMode: 'PAY_PER_REQUEST',
			GlobalSecondaryIndexes: [
				{
					IndexName: 'index1',
					KeySchema: [
						{
							AttributeName: 'pk',
							KeyType: 'HASH'
						},
						{
							AttributeName: 'sk',
							KeyType: 'RANGE'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				},
				{
					IndexName: 'index2',
					KeySchema: [
						{
							AttributeName: 'username',
							KeyType: 'HASH'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			]
		}
	},
	InvitesTable: {
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			TableName: '${self:custom.tables.invitesTable}',
			AttributeDefinitions: [
				{
					AttributeName: 'id',
					AttributeType: 'S'
				},
				{
					AttributeName: 'pk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'sk',
					AttributeType: 'S'
				}
			],

			KeySchema: [
				{
					AttributeName: 'id',
					KeyType: 'HASH'
				}
			],
			BillingMode: 'PAY_PER_REQUEST',
			GlobalSecondaryIndexes: [
				{
					IndexName: 'index1',
					KeySchema: [
						{
							AttributeName: 'pk',
							KeyType: 'HASH'
						},
						{
							AttributeName: 'sk',
							KeyType: 'RANGE'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			]
		}
	},
	CategoriesTable: {
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			TableName: '${self:custom.tables.categoriesTable}',
			AttributeDefinitions: [
				{
					AttributeName: 'id',
					AttributeType: 'S'
				},
				{
					AttributeName: 'pk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'sk',
					AttributeType: 'S'
				}
			],

			KeySchema: [
				{
					AttributeName: 'id',
					KeyType: 'HASH'
				}
			],
			BillingMode: 'PAY_PER_REQUEST',
			GlobalSecondaryIndexes: [
				{
					IndexName: 'index1',
					KeySchema: [
						{
							AttributeName: 'pk',
							KeyType: 'HASH'
						},
						{
							AttributeName: 'sk',
							KeyType: 'RANGE'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			]
		}
	},
	videosTable: {
		DeletionPolicy: 'Delete',
		Type: 'AWS::DynamoDB::Table',
		Properties: {
			TableName: '${self:custom.tables.videosTable}',
			AttributeDefinitions: [
				{
					AttributeName: 'id',
					AttributeType: 'S'
				},
				{
					AttributeName: 'pk',
					AttributeType: 'S'
				},
				{
					AttributeName: 'sk',
					AttributeType: 'S'
				}
			],

			KeySchema: [
				{
					AttributeName: 'id',
					KeyType: 'HASH'
				}
			],
			BillingMode: 'PAY_PER_REQUEST',
			GlobalSecondaryIndexes: [
				{
					IndexName: 'index1',
					KeySchema: [
						{
							AttributeName: 'pk',
							KeyType: 'HASH'
						},
						{
							AttributeName: 'sk',
							KeyType: 'RANGE'
						}
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			]
		}
	}
};

export default DynamoResources;
