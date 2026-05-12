import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return children
}
