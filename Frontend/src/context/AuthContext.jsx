import React, { createContext, useContext, useState, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  // Support backward compatibility if adminEmail exists
  if (!user && localStorage.getItem('adminEmail')) {
    const adminEmail = localStorage.getItem('adminEmail');
    setUser({ email: adminEmail, role: 'admin', name: 'Admin' });
  }

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'admin'

  const handleAuthResponse = (data) => {
    setToken(data.token)
    const userData = { email: data.email, role: data.role, name: data.name }
    setUser(userData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (res.ok) {
      handleAuthResponse(data);
      return { success: true }
    } else {
      return { success: false, message: data.message || 'Login failed' }
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()

    if (res.ok) {
      handleAuthResponse(data);
      return { success: true }
    } else {
      return { success: false, message: data.message || 'Registration failed' }
    }
  }, [])

  const googleLogin = useCallback(async (credential) => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    })
    const data = await res.json()

    if (res.ok) {
      handleAuthResponse(data);
      return { success: true }
    } else {
      return { success: false, message: data.message || 'Google Login failed' }
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminEmail') // Legacy cleanup
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
