import React, { useState } from 'react'
import {useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
//import {axiosWithToken} from '../axiosWithToken'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Addarticles() {
  let {register,handleSubmit}=useForm();
  let {currentUser}=useSelector(state=>state.userLogin)
  let [err,setErr]=useState('');
  let navigate=useNavigate();

  //axios with token function
  let token=sessionStorage.getItem('token')
  const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
  })

  //form submit
  const addNewArticle=async(data)=>{
    data.articleId=Date.now();
    data.dateOfCreation= new Date();
    data.dateOfModification=new Date();
    data.comments=[];
    data.username=currentUser.username;
    data.status=true;
    //make http post request to AUTHOR API
    let res = await axiosWithToken.post('http://localhost:4000/author-api/new-article',data);
    console.log('response at frontend',res.data.message);
    if(res.data.message=="NEW ARTICLE ADDED"){
      //NAVIGATE TO AUTHOR ARTICLES BY AUTHOR NAME
      //we have to give complete path
      navigate(`/author-profile/articles-by-author/${currentUser.username}`)

    }
    else{
      setErr(res.data.message);
    }
    

    console.log(data);

  }
  return (
    <div className='mt-5 p-5 bg-light'>
      <form className='w-50 mx-auto p-5' onSubmit={handleSubmit(addNewArticle)}>
      <label className='form-label mb-3' for="title" >TITLE</label>
      <input type='text' id='title' className='form-control mb-3' placeholder='TITLE'  {...register("title")}></input>
      <div className='form-group mb-3'>
        <label for="select-grp" className='mb-3'>CATEGORY</label>
        <select className='form-control' id='select-grp' {...register("category")}>
          <option value="Programming">Programming</option>
          <option value="AI&ML">AI & ML</option>
          <option value="Database">Database</option>
        </select>
      </div>

      <label className='form-label mb-3'for="content" >CONTENT</label>
      <textarea id='content' rows="10"  className='form-control mb-3'  {...register("content")}></textarea>

      <button className='btn btn-success'>Post</button>
      </form>
    </div>
  )
}

export default Addarticles