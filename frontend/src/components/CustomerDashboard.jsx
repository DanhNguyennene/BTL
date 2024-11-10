import React from 'react'
import { useAuth } from '../contexts/AuthContext'
const CustomerDashboard = () => {
  const { userInfo, logout, isAuthenticated } = useAuth();
  console.log(userInfo.username)
  
  return (
    <div>
      <h1>Welcome User {userInfo.username}</h1>
    </div>
  )
}

export default CustomerDashboard
