import React from 'react'
import Navbar from '../landingpage/Navbar'
import { Outlet } from 'react-router'

const UserLayout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default UserLayout