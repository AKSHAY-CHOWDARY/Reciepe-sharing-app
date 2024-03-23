import React from 'react'
import { Link,Outlet } from 'react-router-dom';

function AuthorProfile() {
  return (
    <div>
      <div className='container'>
        <ul className='navbar nav justify-content-center'>
          <li className='nav-item'>
            <Link className='nav-link' to="add-articles">Add Articles</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link active' to="articles-by-author/:author">My Articles</Link>
          </li>
        </ul>
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthorProfile;