import React from 'react'
import { useAuth } from '../contexts/AuthContext'
const CustomerDashboard = () => {
  const { userInfo, logout, isAuthenticated } = useAuth();
  console.log(userInfo.username)
  
  return (
    <div>

      Hello
    </div>
  )
}

export default CustomerDashboard
