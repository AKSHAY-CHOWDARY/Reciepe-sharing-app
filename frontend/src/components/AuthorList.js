import React from 'react'
import axios from 'axios';
import { useEffect,useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function AuthorList() {

  const [authorList,setAuthorList]=useState([]);
  const [err,setErr]=useState('');
  const navigate=useNavigate();

  const token=sessionStorage.getItem('token');
  const axiosWithToken= axios.create({
    headers:{Authorization:`Bearer ${token}`}
  });

  const getAuthors=async()=>{
    try {
      const res = await axiosWithToken.get('http://localhost:4000/admin-api/author-list');
      if (res.data.message === "author list") {
        setAuthorList(res.data.payload); 
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setErr("Failed to fetch user list");
    }
  }
 const getAuthorByUsername=(user)=>{
  navigate(`../user/${user.username}`,{state:user})
 }


  useEffect(()=>{
    getAuthors();
  },[]);

  return (
       <div>
      { authorList.length===0 ? (
        <h2>NO Authors FOUND</h2>
      ):(
        <div className='container p-5 '>
          {authorList.map((author)=>(
            <div className='row p-3 d-flex'>
            <div>
            <p className='m-3'>username: {author.username}</p>
            <small className=' ms-5 m-3'>email : {author.email}</small>
            </div>
            <button className='btn btn-info' onClick={()=>getAuthorByUsername(author)}>Profile --</button>
            </div>
          ))}
        </div>
      )}
      <Outlet/>
    </div>
  )
}

export default AuthorList