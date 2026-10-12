export const conf = {
  appWriteUrl: import.meta.env.VITE_APPWRITE_URL ?? '',
  appWriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID ?? '',
  appWriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ?? '',
  appWriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID ?? '',
  appWriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID ?? '',
}

// Names of the env vars that are still empty, so the setup screen can list them
export const missingEnvVars = [
  ['VITE_APPWRITE_URL', conf.appWriteUrl],
  ['VITE_APPWRITE_PROJECT_ID', conf.appWriteProjectId],
  ['VITE_APPWRITE_DATABASE_ID', conf.appWriteDatabaseId],
  ['VITE_APPWRITE_COLLECTION_ID', conf.appWriteCollectionId],
  ['VITE_APPWRITE_BUCKET_ID', conf.appWriteBucketId],
]
  .filter(([, value]) => !value)
  .map(([name]) => name)

export const isAppwriteConfigured = missingEnvVars.length === 0
