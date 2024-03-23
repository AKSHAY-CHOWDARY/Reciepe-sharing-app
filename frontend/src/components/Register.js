import React from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'


function Register() {
  
  let {register,handleSubmit}=useForm();
  let [err,setErr]=useState('');
  let navigate=useNavigate()
  //FORM SUBMIT
  async function handleFormSubmit(userObj){
    if(userObj.userType=='user'){
    let res=await axios.post('http://localhost:4000/user-api/user',userObj);
    if(res.data.message=='user created'){
      //NAVIGATE TO SIGN IN COMPONENT
      navigate('/login')
    }else{
      setErr(res.data.message);
    }
    }
    if(userObj.userType=='author'){
      let res=await axios.post('http://localhost:4000/author-api/user',userObj);
      if(res.data.message=='author created'){
        //navigate to signin component
        navigate('/login')
      }else{
        setErr(res.data.message)
      }
    }
  }
  return (
    <div className='mt-5 p-5 bg-light'>
      <form className='w-50 mx-auto p-5' onSubmit={handleSubmit(handleFormSubmit)}>
        {/*USER REGISTER ERROR MESSAGE*/}
        {err.length!=0 && <p className='text-danger text-center'>{err}</p>}
        <div className='d-flex'>
        <div className='form-check m-3'>
          <input type='radio' id='author' value="author" className='form-check-input' {...register("userType")}></input>
          <label htmlFor='author' className='form-check-label'>Author</label>
          </div>
        <div className='form-check m-3'>
          <input type='radio' id='user' value="user" className='form-check-input' {...register("userType")}></input>
          <label htmlFor='user' className='form-check-label'>User</label>
        </div>
        </div>
        <input type='text' className='form-control mb-3' placeholder='Username' {...register("username")}></input>
        <input type='password' className='form-control mb-3' placeholder='password' {...register("password")}></input>
        <input type='email' className='form-control mb-3' placeholder='email id' {...register("email")}></input>
        <button type='submit' className='btn btn-success d-flex justify-content-end'>Register</button>
      </form>
    </div>
  )
}

export default Register
