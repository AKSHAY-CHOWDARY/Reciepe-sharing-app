import React from 'react'
import {Link,Outlet} from 'react-router-dom'
function UserProfile() {
  return (
    <div>
      <ul className='navbar nav'>
        <li className='list-item text-center'>
          <Link className='nav-link' to="articles">ARTICLES</Link>
        </li>
      </ul>
      <Outlet/>
    </div>
  )
}

export default UserProfile