import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next' 
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Detect scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false); 
  }

  // Styling helper for Links
  const navLinkClass = ({ isActive }) => 
    `text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-saffron-600 ${
      isActive ? "text-saffron-700 border-b-2 border-saffron-500 pb-1" : "text-slate-600"
    }`;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-saffron-100" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to='/' className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-saffron-500 to-maroon-500 text-white shadow-lg group-hover:scale-105 transition-transform">
            {/* Om Symbol */}
            <span className="text-xl font-bold">ॐ</span>
          </div>
          <div>
            <div className="text-lg font-serif font-bold text-maroon-700 leading-tight tracking-tight">{t('siteTitle') || 'Sanatan Charcha'}</div>
            <div className="text-[10px] uppercase tracking-widest text-saffron-600 font-semibold">{t('tagline') || 'Wisdom & Community'}</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink to='/' className={navLinkClass}>{t('nav.home') || 'HOME'}</NavLink>
          <NavLink to='/library' className={navLinkClass}>{t('nav.library') || 'LIBRARY'}</NavLink>
          <NavLink to='/blog' className={navLinkClass}>{t('nav.blog') || 'BLOG'}</NavLink>
          <NavLink to='/charcha' className={navLinkClass}>{t('nav.discussion') || 'CHARCHA'}</NavLink>
          <NavLink to='/request' className={navLinkClass}>{t('nav.request') || 'REQUEST'}</NavLink>
          {isAdmin && (
            <NavLink to='/admin' className={navLinkClass}>{t('nav.dashboard', { defaultValue: 'DASHBOARD' })}</NavLink>
          )}
          <NavLink to='/niyam' className={navLinkClass}>{t('nav.rules') || 'NIYAM'}</NavLink>
          <NavLink to='/about' className={navLinkClass}>{t('nav.about') || 'ABOUT'}</NavLink>
        </nav>

        {/* Right Side: Language & Donate */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select 
              value={i18n.language} 
              onChange={(e)=>changeLanguage(e.target.value)} 
              className="appearance-none bg-sand-50 border border-saffron-200 rounded-full px-4 py-1 text-sm font-medium text-maroon-700 focus:outline-none hover:border-saffron-400 cursor-pointer"
            >
              <option value="en">🇬🇧 En</option>
              <option value="hi">🇮🇳 Hi</option>
              <option value="sa">🕉️ Sa</option>
              <option value="ta">🛕 Ta</option>
              <option value="te">🏛️ Te</option>
            </select>
          </div>

          {/* Donate Button */}
          <Link to="/communication" className="px-5 py-2 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            {t('donate') || 'Donate'}
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 border-l border-saffron-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-maroon-700 text-white flex items-center justify-center font-bold text-sm" title={user?.name}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button onClick={logout} className="text-xs text-maroon-700 font-bold hover:text-red-500 transition">{t('nav.logout', { defaultValue: 'Logout' })}</button>
            </div>
          ) : (
            <div className="border-l border-saffron-200 pl-3">
              <Link to="/auth" className="px-5 py-2 rounded-full border-2 border-maroon-700 text-maroon-700 font-bold text-sm hover:bg-maroon-700 hover:text-white transition-all">
                {t('nav.signIn', { defaultValue: 'Sign In' })}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button 
          className="md:hidden p-2 text-maroon-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-saffron-100 shadow-xl p-4 flex flex-col gap-4 fade-in">
          <NavLink to='/' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.home') || 'Home'}</NavLink>
          <NavLink to='/library' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.library') || 'Library'}</NavLink>
          <NavLink to='/blog' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.blog') || 'Blog'}</NavLink>
          <NavLink to='/charcha' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.discussion') || '💬 Charcha'}</NavLink>
          <NavLink to='/request' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.request') || '✍️ Request'}</NavLink>
          {isAdmin && (
            <NavLink to='/admin' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-saffron-600 font-bold border-b border-gray-100">⚙️ {t('nav.dashboard', { defaultValue: 'Dashboard' })}</NavLink>
          )}
          <NavLink to='/niyam' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.rules') || '📜 Niyam'}</NavLink>
          <NavLink to='/about' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.about') || 'About'}</NavLink>
          <NavLink to='/communication' onClick={()=>setIsMobileMenuOpen(false)} className="p-2 text-maroon-700 font-semibold border-b border-gray-100">{t('nav.communication') || 'Community'}</NavLink>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
             <select 
              value={i18n.language} 
              onChange={(e)=>changeLanguage(e.target.value)} 
              className="bg-sand-50 border border-saffron-200 rounded px-2 py-1 text-sm"
            >
              <option value="en">En</option>
              <option value="hi">Hi</option>
              <option value="sa">Sa</option>
              <option value="ta">Ta</option>
              <option value="te">Te</option>
            </select>
            <Link to="/communication" onClick={()=>setIsMobileMenuOpen(false)} className="px-4 py-2 rounded-full bg-saffron-500 text-white text-sm font-bold">
              {t('donate') || 'Donate'}
            </Link>
          </div>
          {isAuthenticated ? (
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mt-2 w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition">{t('nav.logout', { defaultValue: 'Logout' })}</button>
          ) : (
            <Link to="/auth" onClick={()=>setIsMobileMenuOpen(false)} className="mt-2 w-full text-center py-2 bg-maroon-700 text-white font-bold rounded-lg hover:bg-maroon-800 transition">{t('nav.signIn', { defaultValue: 'Sign In' })}</Link>
          )}
        </div>
      )}
    </header>
  )
}