import { registerAs } from '@nestjs/config';

export default registerAs('appwrite', () => ({
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'main',
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID || 'users',
  filesCollectionId: process.env.APPWRITE_FILES_COLLECTION_ID || 'files',
  sharesCollectionId: process.env.APPWRITE_SHARES_COLLECTION_ID || 'shares',
  bucketId: process.env.APPWRITE_BUCKET_ID || ''
}));