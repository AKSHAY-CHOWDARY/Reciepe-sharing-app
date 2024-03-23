import React from 'react'
import { Link } from 'react-router-dom'
import './Navigation.css'
import { useSelector,useDispatch } from 'react-redux'

import {resetState} from '../redux/slices/userLoginSlice'

function Navigation() {

  let {isPending,currentUser,errStatus,errMessage,loginStatus}=useSelector(state=>state.userLogin)
  const dispatch=useDispatch();
  function logout(){
    sessionStorage.removeItem('token');
    //reset the state
    let actionObj=resetState();
    //dispatch this action object
    dispatch(actionObj);
  }


  return (
    <div>
        <nav class="navbar navbar-main navbar-expand-lg">
  <div class="container-fluid">
    <Link class="navbar-brand" to="">Navbar</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        {/*use conditional rendering,if login status is true we will display only log out button*/}
        {
        loginStatus==false ?  <><li class="nav-item">
        <Link class="nav-link active" aria-current="page" to="">HOME</Link>
      </li>
      <li class="nav-item">
        <Link class="nav-link" to="register">REGISTER</Link>
      </li>
      <li class="nav-item">
        <Link class="nav-link" to="login">LOGIN</Link>
      </li></>:<>
      <span className='lead mt-2 me-2' style={{color:"yellow"}}>{currentUser.username}</span>
      <li className='nav-item'>
          <Link className='nav-link' to="login" onClick={logout}>LOG OUT</Link>
        </li>

      </>
      }
       

        
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navigation