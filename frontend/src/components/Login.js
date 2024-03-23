import React from 'react'
import {useForm} from 'react-hook-form';
import { userLoginThunk } from '../redux/slices/userLoginSlice';
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function Login() {

  let dispatch=useDispatch();
  let navigate=useNavigate();
  let {isPending,currentUser,errStatus,errMessage,loginStatus}=useSelector(state=>state.userLogin) //userLogin because that is the slics we provided in the store.js
  let {register,handleSubmit}=useForm();
  //FORM SUBMIT
  function handleFormSubmit(data){
    //call action creator function and get the actionObj
    const actionObj=userLoginThunk(data);
    //dispatch the action object to extra reducers
    dispatch(actionObj); 
  }
  useEffect(()=>{
    if(loginStatus==true){
      if(currentUser.userType=='user'){
        navigate('/user-profile');
      }
      if(currentUser.userType=='author'){
        navigate('/author-profile');
      }
      if(currentUser.userType=='admin'){
        navigate('/admin-profile');
      }
    }
  },[loginStatus])
  return (
    <div className='mt-5 p-5 bg-light'>
      <form className='w-50 mx-auto p-5' onSubmit={handleSubmit(handleFormSubmit)}>
        {/* if login failed  */}
        {loginStatus==false ? (
          <p className='text-center text-danger'>{errMessage}</p>
        ):(<></>) }
        
        <div className='d-flex'>
        <div className='form-check m-3'>
          <input type='radio' id='author' value="author" className='form-check-input' {...register("userType")}></input>
          <label htmlFor='author' className='form-check-label'>Author</label>
          </div>
        <div className='form-check m-3'>
          <input type='radio' id='user' value="user" className='form-check-input' {...register("userType")}></input>
          <label htmlFor='user' className='form-check-label'>User</label>
        </div>
        <div className='form-check m-3'>
          <input type='radio' id='admin' value="admin" className='form-check-input' {...register("userType")}></input>
          <label htmlFor='admin' className='form-check-label'>Admin</label>
        </div>
        </div>
        <input type='text' className='form-control mb-3' placeholder='Username' {...register("username")}></input>
        <input type='password' className='form-control mb-3' placeholder='password' {...register("password")}></input>
        <button type='submit' className='btn btn-success d-flex justify-content-end'>Login</button>
      </form>
    </div>
  )
}

export default Login