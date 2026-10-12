//database + storage service
import { Databases, ID, Query, Storage, type Models } from 'appwrite'
import { conf } from '@/conf/conf'
import { client } from './client'

export type PostStatus = 'active' | 'inactive'

export interface PostFields {
  title: string
  content: string
  featuredImage: string
  status: PostStatus
  userId: string
}

export type Post = Models.Document & PostFields

class Service {
  databases = new Databases(client)
  bucket = new Storage(client)

  //the slug doubles as the document id
  async createPost({ slug, ...fields }: PostFields & { slug: string }) {
    return this.databases.createDocument<Post>(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
      fields
    )
  }

  async updatePost(slug: string, fields: Omit<PostFields, 'userId'>) {
    return this.databases.updateDocument<Post>(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug,
      fields
    )
  }

  async deletePost(slug: string) {
    await this.databases.deleteDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug
    )
  }

  async getPost(slug: string) {
    return this.databases.getDocument<Post>(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug
    )
  }

  //by default only active posts are returned, newest first
  async getPosts(queries: string[] = [Query.equal('status', 'active')]) {
    const result = await this.databases.listDocuments<Post>(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      [...queries, Query.orderDesc('$createdAt'), Query.limit(100)]
    )
    return result.documents
  }

  //handling files

  async uploadFile(file: File) {
    return this.bucket.createFile(conf.appWriteBucketId, ID.unique(), file)
  }

  //cleanup only, so a failure here should never break the calling flow
  async deleteFile(fileId: string) {
    try {
      await this.bucket.deleteFile(conf.appWriteBucketId, fileId)
      return true
    } catch (error) {
      console.error('Failed to delete file', error)
      return false
    }
  }

  getFilePreview(fileId: string) {
    return String(this.bucket.getFileView(conf.appWriteBucketId, fileId))
  }
}

const service = new Service()
export default service
