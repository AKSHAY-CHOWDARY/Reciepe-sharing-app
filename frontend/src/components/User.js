import React from 'react'
import { useState ,useEffect} from 'react';
import axios from 'axios';
import {Outlet,useLocation} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function User() {
    const {state} = useLocation();
    const [blockStatusOfUser,setBlockStatusOfUser]=useState(state.blockStatus);
    const navigate=useNavigate();
    const [articleList,setArticleList]=useState([])
    const token=sessionStorage.getItem('token');
    const axiosWithToken= axios.create({
    headers:{Authorization:`Bearer ${token}`}
    });

    const getAuthorArticles=async()=>{
        let res=await axiosWithToken.get(`http://localhost:4000/admin-api/article-of-author/${state.username}`);
        if(res.data.message=='articles of author'){
            setArticleList(res.data.payload);
        }
    }

    const blockUser=async()=>{
      if(state.userType=='user'){
        let res=await axiosWithToken.put(`http://localhost:4000/admin-api/user-list/${state.username}`,state);
        if(res.data.message=="user blocked"){
            console.log("blocked");
          setBlockStatusOfUser(true);
        }
      }
      if(state.userType=='author'){
        let res=await axiosWithToken.put(`http://localhost:4000/admin-api/author-list/${state.username}`,state);
        if(res.data.message=="user blocked"){
            console.log("blocked");
          setBlockStatusOfUser(true);
        }
      }
      }
      const unBlock=async()=>{
        if(state.userType=='user'){
        let res=await axiosWithToken.put(`http://localhost:4000/admin-api/user-list/${state.username}`,state);
        if(res.data.message=="user unblocked"){
            console.log("unblocked");
          setBlockStatusOfUser(false);
        }
        }
        if(state.userType=='author'){
          let res=await axiosWithToken.put(`http://localhost:4000/admin-api/author-list/${state.username}`,state);
          if(res.data.message=="user unblocked"){
            console.log("unblocked");
            setBlockStatusOfUser(false);
          }
        }
      }

      useEffect(()=>{
        getAuthorArticles();
      },[])

      const readArticleById = (article) => {
        navigate(`../article/${article.articleId}`,{state:article});
      };

      
      console.log(articleList);


  return (
    <div>
        <h3>{state.username}</h3>
        <small> {state.userType} </small>
        <p className='lead'> EMAIL : {state.email}</p>
         <div>
            {blockStatusOfUser==false ?
            <button className='btn btn-danger' onClick={blockUser}>Block</button>
            :
            <button className='btn btn-info' onClick={unBlock}>unblock</button>
            }
        </div>
        {state.userType=='author' && <>
        
        <h3 className='mb-3'> Articles by {state.username} </h3>


        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4'>
            {
                articleList.map((article) => (
                    <div className='col' key={article.articleId}>
                      <div className='card card-body h-100'>
                        <h5 className='card-title'>{article.title}</h5>
                        <p className='card-text'>{article.content.substr(0, 150) + "..."}</p>
                        <button className='btn btn-info' onClick={() => readArticleById(article)}>Read more</button>
                      </div>
                      <div className='card-footer'>
                        <small>Last Modified: {article.dateOfModification}</small>
                      </div>
                    </div>
                  ))
            }
        </div>
        
        </>}
    </div>
  )
}

export default User