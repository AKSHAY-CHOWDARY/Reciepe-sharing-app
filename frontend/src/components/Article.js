import React from 'react'
import { useState,useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import {useSelector } from 'react-redux';
import {useForm} from 'react-hook-form'
import axios from 'axios';
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FcDeleteDatabase } from "react-icons/fc";
import { LiaCommentSolid } from "react-icons/lia";

function Article() {
  const {state}=useLocation();
  const {currentUser}=useSelector(state=>state.userLogin);
  const {register,handleSubmit}=useForm();
  let navigate=useNavigate()
  let [commentStatus,setCommentStatus]=useState('');
  let [err,setErr]=useState('');
  let [articleEditStatus,setArticleEditStatus]=useState(false);
  let [articleViewStatus,setArticleViewStatus]=useState(state.status)
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const addComment=async(comment)=>{
    comment.username=currentUser.username;
    let res=await axiosWithToken.post(`http://localhost:4000/user-api/comment/${state.articleId}`,comment);
    if(res.data.message=="comment added"){
      setCommentStatus(res.data.message)
    }else{
      setErr(res.data.message);
    }
    console.log(comment);
  }

  const articleEdit=()=>{
    setArticleEditStatus(true);
  }
  const articleSave=async(editedArticle)=>{
   
    //this edited article will not contain all the properties so we have to add them from the state
    const modifiedArticle={...state,...editedArticle}
    //we have to delete the _Id property from the article because it is an object and it is immutable and also it will be compared
    //with string so we have to delete it to avoid any error
    delete modifiedArticle._id;
    modifiedArticle.dateOfModification=new Date();

    let res=await axiosWithToken.put('http://localhost:4000/author-api/article',modifiedArticle);
    if(res.data.message=='Article edited'){
      setArticleEditStatus(false);
      navigate(`../article/${state.articleId}`,{state:res.data.payload})
    }
    
  }
  //SOFT DELETE ARTICLE
  const deleteArticle=async()=>{
    let copy={...state}
    delete copy._id;
    let res = await axiosWithToken.put(`http://localhost:4000/author-api/article/${copy.articleId}`,copy)
    console.log(res);
    if(res.data.message=="Article deleted"){
      setArticleViewStatus(false);
    }
  }
  //RESTORE ARTICLE BY ID
  const restoreArticle=async()=>{
    let copy={...state}
    delete copy._id;
    let res = await axiosWithToken.put(`http://localhost:4000/author-api/article/${copy.articleId}`,copy)
    console.log(res);
    if(res.data.message=="Article restored"){
      setArticleViewStatus(true);
    }
  }




  //  DEFAULT VALUE PROPERTY IN THE FORM WILL LET US HAVE THE DEFAULT CONTENT IN THE FORM AVAILABLE TO EDIT IT ON SPOT

  return (
    <div>

      {articleEditStatus==true ?  <div className='mt-5 p-5 bg-light'>
      <form className='w-50 mx-auto p-5' onSubmit={handleSubmit(articleSave)}>
      <label className='form-label mb-3' for="title" >TITLE</label>
      <input type='text' id='title' className='form-control mb-3' placeholder='TITLE'  {...register("title")} defaultValue={state.title}></input>
      <div className='form-group mb-3'>
        <label for="select-grp" className='mb-3'>CATEGORY</label>
        <select className='form-control' id='select-grp' {...register("category")} defaultValue={state.category}>
          <option value="Programming">Programming</option>
          <option value="AI&ML">AI & ML</option>
          <option value="Database">Database</option>
        </select>
      </div>

      <label className='form-label mb-3'for="content" >CONTENT</label>
      <textarea id='content' rows="10"  className='form-control mb-3'  {...register("content")} defaultValue={state.content}></textarea>

      <button className='btn btn-success'>Save</button>
      </form>
    </div>
    :
      <div>
    <h2 className='my-3'>{state.title}</h2>
    <div>
    <small className='text-primary m-2'>CREATED ON: {state.dateOfCreation}</small>
    <small className='text-primary m-2'>MODIFIED ON: {state.dateOfModification}</small>
    </div>
    <div className='d-flex justify-content-end'>
      {currentUser.userType==='author' && (
        <>
          <button onClick={articleEdit} className='btn btn-warning m-2'> EDIT </button>
          {articleViewStatus==true ? ( <button onClick={deleteArticle} className='btn btn-danger m-2'> <FcDeleteDatabase/> </button>
          ) : (
          <button className='btn btn-primary' onClick={restoreArticle}><MdOutlineSettingsBackupRestore/></button> 
        )}
          
        </>
      )} 
    </div>
    <div>
    <p style={{whiteSpace:'pre-line'}}>{state.content}</p>
    </div>
    <div>
      {/*user comments*/}
      <div className='container mt-5 mb-5'>
        <p className='fs-3'>COMMENTS</p>
        {state.comments.length===0 ? ( <p className='lead'>No comments</p>
         ) : (
          state.comments.map((comment)=>{
            return <div className='mt-3'>
              <p className='text-warning'><LiaCommentSolid/><span className='ms-3'>{comment.username}</span></p>
              <p className='lead ms-3'>{comment.comment}</p>
            </div>
          })
         )
        } 
      </div>





      <h3>{commentStatus}</h3>
    {currentUser.userType=='user' && (
      <>
      <form onSubmit={handleSubmit(addComment)}>

        <label className='form-control-label mb-3' for="comment"></label>
        <input placeholder='Write a comment' id='comment' type='text' className='mb-3 form-control' {...register("comment")}></input>
        <button type='submit' className='btn btn-success'>post</button>

      </form>
      </>
    )}
    </div>

      </div>
    }

    </div>
  )
}

export default Article