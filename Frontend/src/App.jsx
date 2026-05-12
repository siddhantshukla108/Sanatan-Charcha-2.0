import React, {useEffect} from 'react'
import Communication from './pages/Communication'
import Library from './pages/Library'
import Books from './pages/Books'
import Blog from './pages/Blog'
import AdminDashboard from './pages/AdminDashboard'
import AuthPage from './pages/AuthPage'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import CommunityRules from './pages/CommunityRules'
import ArticleRequest from './pages/ArticleRequest'
import Discussion from './pages/Discussion'
import ProtectedRoute from './components/ProtectedRoute'
import {Routes, Route, useLocation } from 'react-router-dom'
import Footer from './components/Footer'


export default function App(){
const location = useLocation()


useEffect(()=>{
window.scrollTo({top:0,behavior:'smooth'})
},[location.pathname])


return (
<div className="min-h-screen flex flex-col">
<Navbar />
<main className="flex-1 container mx-auto px-4 py-8">
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/about" element={<About/>} />
<Route path="/communication" element={<Communication/>} />
<Route path="/library" element={<Library/>} />
<Route path="/library/books" element={<Books/>} />
<Route path="/blog" element={<Blog/>} />
<Route path="/niyam" element={<CommunityRules/>} />
<Route path="/request" element={<ArticleRequest/>} />
<Route path="/charcha" element={<Discussion/>} />
<Route path="/auth" element={<AuthPage/>} />
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminDashboard/>
  </ProtectedRoute>
} />
<Route path="*" element={
  <div className="text-center py-20">
    <h2 className="text-4xl font-serif font-bold text-maroon-700 mb-4">404 - Page Not Found</h2>
    <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
    <a href="/" className="px-6 py-2 bg-saffron-500 text-white rounded-full font-bold hover:bg-saffron-600 transition">Go to Home</a>
  </div>
} />
</Routes>
</main>
<Footer/>
</div>
)
}