import { Client } from 'appwrite'
import { conf, isAppwriteConfigured } from '@/conf/conf'

// one client shared by the auth and database services
export const client = new Client()

if (isAppwriteConfigured) {
  client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId)
}
