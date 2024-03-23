import React from 'react'
import axios from 'axios';
import { useEffect,useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function UserList() {

  const [userlist,setUserList]=useState([]);
  const [err,setErr]=useState('');
  const navigate=useNavigate();

  const token=sessionStorage.getItem('token');
  const axiosWithToken= axios.create({
    headers:{Authorization:`Bearer ${token}`}
  });

  const getUsers=async()=>{
    try {
      const res = await axiosWithToken.get('http://localhost:4000/admin-api/user-list');
      if (res.data.message === "users list") {
        setUserList(res.data.payload); 
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setErr("Failed to fetch user list");
    }
  }
 const getUserByUsername=(user)=>{
  navigate(`../user/${user.username}`,{state:user})
 }


  useEffect(()=>{
    getUsers();
  },[userlist])


  return (
    <div>
      { userlist.length===0 ? (
        <h2>NO USERS FOUND</h2>
      ):(
        <div className='container p-5 '>
          {userlist.map((user)=>(
            <div className='row p-3 d-flex'>
            <div>
            <p className='m-3'>username: {user.username}</p>
            <small className=' ms-5 m-3'>email : {user.email}</small>
            </div>
            <button className='btn btn-info' onClick={()=>getUserByUsername(user)}>Profile --</button>
            </div>
          ))}
        </div>
      )}
      <Outlet/>
    </div>
  )
}

export default UserList