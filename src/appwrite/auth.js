//can create auth service simply but we want future proof code so in future we need to change our BAAS 
//this prevents vendor lock-in 
// here we create services


// this is authservice
import {conf} from "../conf/conf"
import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    //can create account direclty but it would be more useful when constructor is called
    account;

    constructor(){
        this.client.setEndpoint(conf.appWriteUrl)
        this.client.setProject(conf.appWriteProjectId);

        //on calling constructor creating an account
        this.account = new Account(this.client);
    }

    //destruturing because we send the data from another file
    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                //if user has created an account then login him forcefully
                return this.login({email,password})
            }else{
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }
    
    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
           throw error;
        }
    }

    //checking if user loggedin while landing on homepage or not
    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log(error)
        }

        //safe case if there is problem in try catch block
        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions()
        } catch (error) {
            console.log(error)
        }
    }
}

//using authService can access all the properties of AuthService
const authService = new AuthService();
//here we have used new keyword so have to make a contstructor
export default authService;