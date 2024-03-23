import React from 'react'
//import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

function Articles() {

  let [articleList,setArticleList]=useState([]);
  let navigate=useNavigate();
  let [err,setErr]=useState('');

  let token=sessionStorage.getItem('token')

  const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
  })


  const getArticlesOfCurrentAuthor=async()=>{
    let res=await axiosWithToken.get('http://localhost:4000/user-api/articles');
    if(res.data.message=='ALL ARTICLES'){
      setArticleList(res.data.payload);
    }else{
      setErr(res.data.message);
    }
  }


  useEffect(()=>{
    getArticlesOfCurrentAuthor();
  },[])

  const readArticleById=(article)=>{
    //the navigate will also allow us to send the data to the other component using the second argument in navigate(' ',{});
    navigate(`../article/${article.articleId}`,{state:article})
  }


/*  JS OBJECT FOR ARTICLES 
{
    "articleId":"{{$timestamp}}",
    "title":"Fundamentals of JS",
    "category":"programming",
    "content":"............",
    "dateOfCreation":"{{$datetime iso8601}}",
    "dateOfModification":"{{$datetime iso8601}}",
    "username":"bhanu",
    "comments":[],
    "status":true
}*/ 

  
  return (
    <div>
      {articleList.length==0 ? (
      <h2 className='text-danger'>No articles found</h2>
      ) : (
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-5'>
        {articleList.map((article)=>(
          <div className='col' key={article.articleId}>
            <div className=' card card-body h-100'>
              <h5 className='card-title'>{article.title}</h5>
              <p className='card-text'>{article.content.substr(0,120)+"..."}</p>
              <button className='btn btn-info' onClick={()=>readArticleById(article)}>Read more</button>
            </div>
            <div className='card-footer'>
              <small>Last Modified: {article.dateOfModification}</small>
            </div>
          </div>
        ))}
      </div>
      )}

      <Outlet/>
    </div>
  )
}

export default Articles