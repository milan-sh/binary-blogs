//auth service: the rest of the app only talks to this class, so swapping the
//BaaS later means changing this file and nothing else (prevents vendor lock-in)
import { Account, ID, type Models } from 'appwrite'
import { client } from './client'

export type User = Models.User<Models.Preferences>

export interface Credentials {
  email: string
  password: string
}

export interface NewAccount extends Credentials {
  name: string
}

class AuthService {
  account = new Account(client)

  async createAccount({ email, password, name }: NewAccount) {
    await this.account.create(ID.unique(), email, password, name)
    //once the account exists, log the user straight in
    return this.login({ email, password })
  }

  async login({ email, password }: Credentials) {
    return this.account.createEmailPasswordSession(email, password)
  }

  //null simply means "nobody is logged in"
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.account.get()
    } catch {
      return null
    }
  }

  async logout() {
    await this.account.deleteSessions()
  }
}

const authService = new AuthService()
export default authService
