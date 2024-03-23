import React from 'react'
import { Link,Outlet } from 'react-router-dom'

function AdminProfile() {
  return (
    <div>
      <div className='container'>
        <ul className='navbar nav justify-content-center'>
          <li className='nav-item'>
            <Link className='nav-link' to="user-list"> USERS </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link active' to="author-list">AUTHORS</Link>
          </li>
        </ul>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminProfile