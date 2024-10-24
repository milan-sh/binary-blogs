import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    //want to track user is loggedin or loggedout 
    status:false,
    userData : null,
}

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        login : (state, action)=>{
            state.status = true
            state.userData = action.payload.userData;
            //payload is an object
        },

        logout: (state)=>{
            state.status = false;
            state.userData = null
        }
    }
})


//these login and logout are actions
export const {login, logout} = authSlice.actions

//exporting reducer so that can give access to children
export default authSlice.reducer