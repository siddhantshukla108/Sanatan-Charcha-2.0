import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, googleLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (isAdmin) navigate('/admin');
    else navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.success) {
      // Navigate based on role
      // AuthContext takes a split second to update state, so we handle routing post-render
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('auth.googleFail', { defaultValue: 'Google Sign In failed' }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-saffron-100"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
              ॐ
            </div>
            <h2 className="text-2xl font-serif font-bold text-maroon-700">
              {isLogin ? t('auth.loginTitle', { defaultValue: 'Welcome Back' }) : t('auth.signupTitle', { defaultValue: 'Create an Account' })}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {isLogin ? t('auth.loginSub', { defaultValue: 'Sign in to request articles and participate in Charcha' }) : t('auth.signupSub', { defaultValue: 'Join our cultural community' })}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.displayName', { defaultValue: 'Display Name' })}</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 rounded-xl bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-200 outline-none"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('auth.displayName', { defaultValue: 'Display Name' })}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.emailLabel', { defaultValue: 'Email Address' })}</label>
              <input 
                type="email" 
                required 
                className="w-full p-3 rounded-xl bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-200 outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.passwordLabel', { defaultValue: 'Password' })}</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 rounded-xl bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-200 outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-800 text-white font-bold hover:shadow-lg transition-all disabled:opacity-70 mt-4"
            >
              {loading ? t('auth.processing', { defaultValue: 'Processing...' }) : (isLogin ? t('auth.signInBtn', { defaultValue: 'Sign In' }) : t('auth.signUpBtn', { defaultValue: 'Sign Up' }))}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-slate-400 font-semibold uppercase tracking-wider">{t('auth.or', { defaultValue: 'OR' })}</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">
              {isLogin ? t('auth.noAccount', { defaultValue: "Don't have an account?" }) : t('auth.hasAccount', { defaultValue: "Already have an account?" })}
            </span>
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-saffron-600 font-bold hover:text-saffron-800 transition"
            >
              {isLogin ? t('auth.signUpBtn', { defaultValue: 'Sign Up' }) : t('auth.signInBtn', { defaultValue: 'Sign In' })}
            </button>
          </div>
        </div>
        
        {isLogin && (
          <div className="bg-sand-50 p-4 border-t border-saffron-100 text-center">
            <p className="text-xs text-slate-500">
              {t('auth.adminNote', { defaultValue: 'Admins: Log in above with your official credentials to access the Dashboard.' })}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
