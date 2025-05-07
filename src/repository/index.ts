import dotenv from 'dotenv';
import Dynamo from '@libs/Dynamo';
import { InviteRecord, UsersRecord } from 'src/types/dynamo';
import { USERS_TABLE, INVITES_TABLE } from 'src/utils/env';

dotenv.config();

export const updateUser = async (updateDetails: UsersRecord) => {
	const timestamp = Date.now();
	return await Dynamo.write({
		tableName: USERS_TABLE,
		data: {
			...updateDetails,
			sk: `email#${timestamp}`,
			dateUpdated: timestamp
		}
	});
};

export const findUserInvite = async (id: string) => {
	return await Dynamo.get<InviteRecord>({
		pkKey: 'id',
		pkValue: id,
		tableName: INVITES_TABLE
	});
};
