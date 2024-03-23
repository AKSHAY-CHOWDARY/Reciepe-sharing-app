import React from 'react'
import Navigation from './components/Navigation'
import { Outlet } from 'react-router-dom'
import './RouteLayout.css'
import Footer from './components/Footer'

function RouteLayout() {
  return (
    <div>
      <Navigation />
      <div style={{ minHeight: "70vh" }}>
        <div className="container">
          {" "}
          <Outlet />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <Footer />
      </div>
    </div>
  )
}

export default RouteLayout