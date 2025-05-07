import dotenv from 'dotenv';
dotenv.config();

export const REGION = process.env.REGION;
export const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
export const CATEGORIES_TABLE = process.env.categoriesTable;
export const USERS_TABLE = process.env.usersTable;
export const INVITES_TABLE = process.env.invitesTable;
export const PLANS_TABLE = process.env.plansTable;
export const VIDEOS_TABLE = process.env.videosTable;
export const DEV_CLIENT_URL = process.env.DEV_CLIENT_URL;
export const TEST_CLIENT_URL = process.env.TEST_CLIENT_URL;
export const PROD_CLIENT_URL = process.env.PROD_CLIENT_URL;
export const VIDEO_INPUT_BUCKET = process.env.VIDEO_INPUT_BUCKET;
export const PRE_SIGNED_URL_BUCKET = process.env.PRE_SIGNED_URL_BUCKET;
export const VIDEO_INPUT_DEST_BUCKET = process.env.VIDEO_INPUT_DEST_BUCKET;
export const SOURCE_EMAIL = process.env.SOURCE_EMAIL;
export const REPLY_TO_ADDRESS = process.env.REPLY_TO_ADDRESS;
export const IMAGE_BUCKET = process.env.IMAGE_BUCKET;
export const PRESIGNED_URL_UPLOAD_BUCKET = process.env.PRESIGNED_URL_UPLOAD_BUCKET;
export const USER_POOL_ID = process.env.USER_POOL_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
export const SQS_MESSAGE_DELAY = process.env.SQS_MESSAGE_DELAY
export const PRESIGNED_URL_EXPIRE_TIME = process.env.PRESIGNED_URL_EXPIRE_TIME
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY