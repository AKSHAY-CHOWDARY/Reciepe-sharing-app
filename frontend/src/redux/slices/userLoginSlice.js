import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userLoginThunk=createAsyncThunk('userLogin',async(userCred,thunkApi)=>{
    let res;
    if(userCred.userType=='user'){
        res=await axios.post('http://localhost:4000/user-api/login',userCred);
    }
    if(userCred.userType=='author'){
        res=await axios.post('http://localhost:4000/author-api/login',userCred);
    }
    if(userCred.userType=='admin'){
        res=await axios.post('http://localhost:4000/admin-api/login',userCred);
    }
    if(res.data.message=='Login success'){
        //store the BEARER TOKEN IN SESSIONAL STORAGE temporarily this is useful because whenever a user logs into a public device 
        //and forgets to log out by clearing the sessional storage after shut down of the machine it will automatically clear out the
        //token details and prevent the misuse of the token by other users and hence it will help to automatically log out of the application
        //it will be under application tab in inspect
        sessionStorage.setItem('token',res.data.token)
        return res.data;

    }else{
        return thunkApi.rejectWithValue(res.data.message)
    }
})

export const userLoginSlice=createSlice({
    name:'user-login-slice',
    initialState:{isPending:false,currentUser:{},errStatus:false,errMessage:'',loginStatus:false}, //is pending property can help us to put a loading icon whenever there is a pending state
    reducers:{
        resetState:(state,payload)=>{
            state.isPending=false;
            state.currentUser={};
            state.errStatus=false;
            state.errMessage="";
            state.loginStatus=false;
        }
    }, //REDUCERS THEY DEAL WITH THE CHANGES IN LOCAL STATE
    extraReducers:builder=>builder //EXTRA REDUCERS WILL DEAL WITH CHANGES OF EXTERNAL CHANGES LIKE STATE IS BEING CHANGED BASED ON EXTERNAL API WHICH IS NOT A PART OF REACT APPLICATION
    .addCase(userLoginThunk.pending,(state,action)=>{
        state.isPending=true;
    })
    .addCase(userLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.user; //we can understand the destructuring of the payload using the redux dev tools 
        state.errStatus=false;
        state.errMessage="";
        state.loginStatus=true;
    })
    .addCase(userLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser={};
        state.errStatus=true;
        state.errMessage=action.payload;
        state.loginStatus=false;
    })
})

//export root reducer 
export default userLoginSlice.reducer;
//export action creater functions
export const {resetState}=userLoginSlice.actions;