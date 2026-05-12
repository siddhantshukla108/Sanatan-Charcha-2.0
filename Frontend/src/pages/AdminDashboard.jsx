import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaInbox, FaPlusCircle, FaBook, FaUsers, FaChartLine, 
  FaCheckCircle, FaTimesCircle, FaClock, FaCheckDouble,
  FaList, FaBookOpen
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { token, user, logout } = useAuth();

  // Dashboard State
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data State
  const [inboxMessages, setInboxMessages] = useState([]);
  const [articleRequests, setArticleRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blog Form
  const [editingPostId, setEditingPostId] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogFile, setBlogFile] = useState(null);

  // Book Form
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookLang, setBookLang] = useState('Hindi');
  const [bookCover, setBookCover] = useState(null);
  const [bookPdf, setBookPdf] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [msgRes, reqRes, postRes, bookRes] = await Promise.all([
        fetch(`${API_URL}/api/contact`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/requests/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/content`),
        fetch(`${API_URL}/api/books`)
      ]);
      
      if (msgRes.ok) setInboxMessages(await msgRes.json());
      if (reqRes.ok) setArticleRequests(await reqRes.json());
      if (postRes.ok) setPosts(await postRes.json());
      if (bookRes.ok) setBooks(await bookRes.json());
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status, adminNote = '') => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, adminNote })
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Delete this request permanently?')) return;
    try {
      const res = await fetch(`${API_URL}/api/requests/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleBlogUpload = async (e) => {
    e.preventDefault();
    if (!blogTitle || !blogExcerpt || !blogContent) return alert('Title, excerpt, and content required');
    const formData = new FormData();
    formData.append('title', blogTitle);
    formData.append('excerpt', blogExcerpt);
    formData.append('content', blogContent);
    if (blogFile) formData.append('media', blogFile);
    
    const endpoint = editingPostId ? `/api/admin/edit/${editingPostId}` : '/api/admin/upload';
    const method = editingPostId ? 'PUT' : 'POST';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, { method, headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { 
        alert(editingPostId ? 'Blog Updated!' : 'Blog Published!'); 
        setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogFile(null); setEditingPostId(null);
        fetchAllData();
        setActiveTab('manage-posts');
      } else {
        const err = await res.json();
        alert(err.message || 'Upload failed');
      }
    } catch (err) { console.error(err); }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleEditPost = (post) => {
    setBlogTitle(post.title);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogFile(null);
    setEditingPostId(post._id);
    setActiveTab('blog');
  };

  const handleBookUpload = async (e) => {
    e.preventDefault();
    if (!bookTitle || !bookPdf || !bookCover) return alert('Book details, cover image, and PDF are required');
    const formData = new FormData();
    formData.append('title', bookTitle);
    formData.append('author', bookAuthor);
    formData.append('description', bookDescription);
    formData.append('language', bookLang);
    formData.append('cover', bookCover);
    formData.append('pdf', bookPdf);
    try {
      const res = await fetch(`${API_URL}/api/books/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { 
        alert('Book Added!'); 
        setBookTitle(''); setBookAuthor(''); setBookDescription(''); setBookCover(null); setBookPdf(null); 
        fetchAllData();
        setActiveTab('manage-books');
      } else {
        const err = await res.json();
        alert(err.message || 'Upload failed');
      }
    } catch (err) { console.error(err); }
  };

  const deleteBook = async (id) => {
    if (!window.confirm(t('adminDashboard.confirmDelete', { defaultValue: 'Delete this book permanently?' }))) return;
    try {
      const res = await fetch(`${API_URL}/api/books/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'approved': return <FaCheckCircle className="text-green-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      case 'published': return <FaCheckDouble className="text-blue-500" />;
      default: return null;
    }
  };

  const pendingRequests = articleRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-saffron-100 flex flex-col md:flex-row justify-between items-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron-500 via-maroon-600 to-saffron-500"></div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-maroon-900 flex items-center justify-center text-white text-3xl shadow-lg">
              ॐ
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-maroon-700">{t('adminDashboard.title', { defaultValue: 'Admin Command Center' })}</h1>
              <p className="text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t('adminDashboard.authorizedAs', { defaultValue: 'Authorized as' })} <span className="font-bold text-maroon-900">{user?.email}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="mt-6 md:mt-0 px-8 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-full transition-all border border-red-200"
          >
            {t('nav.logout', { defaultValue: 'Logout' })}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-3">
            {[
              { key: 'overview', label: t('adminDashboard.overview', { defaultValue: 'Overview' }), icon: <FaChartLine />, badge: null },
              { key: 'requests', label: t('admin.tabs.requests', { defaultValue: 'Article Requests' }), icon: <FaUsers />, badge: pendingRequests.length },
              { key: 'inbox', label: t('admin.tabs.inbox', { defaultValue: 'Inbox Messages' }), icon: <FaInbox />, badge: inboxMessages.length },
              { key: 'manage-posts', label: t('adminDashboard.managePosts', { defaultValue: 'Manage Posts' }), icon: <FaList />, badge: null },
              { key: 'blog', label: t('adminDashboard.publishBlog', { defaultValue: 'Publish Blog' }), icon: <FaPlusCircle />, badge: null },
              { key: 'manage-books', label: t('adminDashboard.manageLibrary', { defaultValue: 'Manage Library' }), icon: <FaBookOpen />, badge: null },
              { key: 'library', label: t('adminDashboard.addBook', { defaultValue: 'Add Book' }), icon: <FaBook />, badge: null },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all shadow-sm ${
                  activeTab === tab.key 
                    ? 'bg-maroon-900 text-white shadow-maroon-200 shadow-lg translate-x-2' 
                    : 'bg-white text-slate-600 hover:bg-saffron-50 border border-saffron-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeTab === tab.key ? 'text-saffron-400' : 'text-saffron-600'}>{tab.icon}</span>
                  {tab.label}
                </div>
                {tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-saffron-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-saffron-100 min-h-[600px]"
              >
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 flex items-center gap-3 border-b pb-4">
                      <FaChartLine className="text-saffron-500" /> Platform Overview
                    </h2>
                    
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-saffron-50 rounded-2xl border border-saffron-100 text-center">
                          <div className="text-saffron-600 text-3xl mb-2 font-bold">{articleRequests.length}</div>
                          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Requests</div>
                        </div>
                        <div className="p-6 bg-maroon-50 rounded-2xl border border-maroon-100 text-center">
                          <div className="text-maroon-600 text-3xl mb-2 font-bold">{inboxMessages.length}</div>
                          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Inbox Messages</div>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                          <div className="text-blue-600 text-3xl mb-2 font-bold">{posts.length}</div>
                          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Published Posts</div>
                        </div>
                      </div>
                    )}

                    <div className="bg-sand-50 p-6 rounded-3xl border border-saffron-200">
                       <h3 className="font-bold text-maroon-700 mb-4">Quick Actions</h3>
                       <div className="flex flex-wrap gap-4">
                          <button onClick={() => { setEditingPostId(null); setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogFile(null); setActiveTab('blog'); }} className="px-6 py-3 bg-maroon-900 text-white rounded-xl font-bold text-sm hover:scale-105 transition flex items-center gap-2 shadow-lg">
                             <FaPlusCircle /> Write Article
                          </button>
                          <button onClick={() => setActiveTab('library')} className="px-6 py-3 bg-saffron-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition flex items-center gap-2 shadow-lg">
                             <FaBook /> Add Scripture
                          </button>
                       </div>
                    </div>
                  </div>
                )}

                {/* ARTICLE REQUESTS TAB */}
                {activeTab === 'requests' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 border-b pb-4">Article Requests</h2>
                    {loading ? <p className="animate-pulse">Fetching requests...</p> : articleRequests.length === 0 ? (
                      <div className="text-center py-20 bg-sand-50 rounded-3xl border-2 border-dashed border-saffron-200">
                         <p className="text-slate-400">No requests from the community yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {articleRequests.map(req => (
                          <div key={req._id} className="p-6 bg-white border border-saffron-100 rounded-2xl shadow-sm hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                  <h4 className="text-lg font-bold text-maroon-900 mb-1">{req.topic}</h4>
                                  <div className="flex gap-2 items-center">
                                     <span className="text-[10px] font-bold px-2 py-0.5 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full">{req.category}</span>
                                     <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-500 border border-gray-200 rounded-full flex items-center gap-1">
                                        {getStatusIcon(req.status)} {req.status.toUpperCase()}
                                     </span>
                                  </div>
                               </div>
                               <button onClick={() => deleteRequest(req._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                  <FaTimesCircle />
                               </button>
                            </div>
                            <p className="text-sm text-slate-600 bg-sand-50/50 p-4 rounded-xl border border-sand-100 mb-4">{req.description || 'No description provided.'}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                               <div className="text-xs text-slate-400">By <strong className="text-slate-600">{req.requesterName}</strong> • {new Date(req.createdAt).toLocaleDateString()}</div>
                               <div className="flex gap-2">
                                  {req.status === 'pending' && (<>
                                    <button onClick={() => updateRequestStatus(req._id, 'approved')} className="px-4 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-100 transition">Approve</button>
                                    <button onClick={() => updateRequestStatus(req._id, 'rejected')} className="px-4 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-100 transition">Reject</button>
                                  </>)}
                                  {req.status === 'approved' && (
                                    <button onClick={() => updateRequestStatus(req._id, 'published')} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-100 transition">Mark Published</button>
                                  )}
                                  {(req.status === 'rejected' || req.status === 'published') && (
                                    <button onClick={() => updateRequestStatus(req._id, 'pending')} className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition">Reset Status</button>
                                  )}
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* INBOX TAB */}
                {activeTab === 'inbox' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 border-b pb-4">Community Inbox</h2>
                    {inboxMessages.length === 0 ? (
                       <div className="text-center py-20 bg-sand-50 rounded-3xl border-2 border-dashed border-saffron-200">
                          <p className="text-slate-400">Your inbox is quiet. No new messages.</p>
                       </div>
                    ) : (
                      <div className="space-y-4">
                        {inboxMessages.map(msg => (
                          <div key={msg._id} className="p-6 bg-white border border-saffron-100 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-saffron-400"></div>
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h4 className="font-bold text-maroon-900">{msg.name}</h4>
                                  <p className="text-xs text-saffron-600 font-bold">{msg.email}</p>
                               </div>
                               <span className="text-[10px] text-slate-400">{new Date(msg.date).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed bg-sand-50 p-4 rounded-xl">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MANAGE POSTS TAB */}
                {activeTab === 'manage-posts' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 border-b pb-4">Manage Blog Posts</h2>
                    {loading ? <p className="animate-pulse">Fetching posts...</p> : posts.length === 0 ? (
                       <div className="text-center py-20 bg-sand-50 rounded-3xl border-2 border-dashed border-saffron-200">
                          <p className="text-slate-400">No blog posts found.</p>
                       </div>
                    ) : (
                      <div className="space-y-4">
                        {posts.map(post => (
                          <div key={post._id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition">
                            {post.mediaUrl && (
                                <img src={`${API_URL}${post.mediaUrl}`} alt="cover" className="w-full md:w-24 h-24 object-cover rounded-xl" />
                            )}
                            <div className="flex-1 w-full">
                                <h4 className="font-bold text-maroon-900">{post.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                                <span className="text-xs text-saffron-600">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => handleEditPost(post)} className="flex-1 md:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-sm transition">Edit</button>
                                <button onClick={() => deletePost(post._id)} className="flex-1 md:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PUBLISH BLOG TAB */}
                {activeTab === 'blog' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <h2 className="text-2xl font-serif font-bold text-maroon-700">
                        {editingPostId ? 'Edit Article' : 'Publish New Article'}
                      </h2>
                      {editingPostId && (
                        <button onClick={() => { setEditingPostId(null); setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogFile(null); }} className="text-sm text-slate-500 hover:text-red-500">Cancel Edit</button>
                      )}
                    </div>
                    <form onSubmit={handleBlogUpload} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headline</label>
                            <input type="text" placeholder="Title of the article" className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none transition shadow-inner" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Short Summary</label>
                            <input type="text" placeholder="Catchy excerpt" className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none transition shadow-inner" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Content</label>
                         <textarea rows="10" placeholder="Write the wisdom here..." className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none transition shadow-inner resize-none" value={blogContent} onChange={e => setBlogContent(e.target.value)} />
                      </div>
                      <div className="p-6 bg-sand-50 rounded-2xl border border-dashed border-saffron-300">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Featured Media (Image/Video)</label>
                         <input type="file" onChange={e => setBlogFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-maroon-900 file:text-white file:font-bold hover:file:bg-maroon-800 transition cursor-pointer"/>
                      </div>
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-saffron-500 to-maroon-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition">
                         {editingPostId ? 'Update Article' : 'Publish to Site'}
                      </button>
                    </form>
                  </div>
                )}

                {/* MANAGE BOOKS TAB */}
                {activeTab === 'manage-books' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 border-b pb-4">Manage Library Books</h2>
                    {loading ? <p className="animate-pulse">Fetching books...</p> : books.length === 0 ? (
                       <div className="text-center py-20 bg-sand-50 rounded-3xl border-2 border-dashed border-saffron-200">
                          <p className="text-slate-400">No books found in the library.</p>
                       </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {books.map(book => (
                          <div key={book._id} className="p-4 bg-white border border-slate-200 rounded-2xl flex gap-4 hover:shadow-md transition">
                            {book.coverUrl ? (
                                <img src={`${API_URL}${book.coverUrl}`} alt="cover" className="w-16 h-24 object-cover rounded shadow" />
                            ) : (
                                <div className="w-16 h-24 bg-maroon-800 flex items-center justify-center text-xs text-white p-2 text-center rounded shadow">{book.title}</div>
                            )}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-maroon-900 text-sm">{book.title}</h4>
                                    <p className="text-xs text-slate-500 mb-1">{book.author}</p>
                                    <span className="text-[10px] bg-sand-100 px-2 py-0.5 rounded">{book.language}</span>
                                </div>
                                <button onClick={() => deleteBook(book._id)} className="self-start mt-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs transition">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ADD BOOK TAB */}
                {activeTab === 'library' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-maroon-700 border-b pb-4">Add Scripture to Library</h2>
                    <form onSubmit={handleBookUpload} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Book Title</label>
                            <input type="text" placeholder="Title" className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none shadow-inner" value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Author / Rishi</label>
                            <input type="text" placeholder="Name" className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none shadow-inner" value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Language</label>
                            <select className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none shadow-inner cursor-pointer" value={bookLang} onChange={e => setBookLang(e.target.value)}>
                               <option>Hindi</option><option>Sanskrit</option><option>English</option><option>Tamil</option><option>Telugu</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                            <input type="text" placeholder="Short description" className="w-full p-4 bg-sand-50 border border-saffron-100 rounded-xl focus:border-saffron-500 outline-none shadow-inner" value={bookDescription} onChange={e => setBookDescription(e.target.value)} />
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-sand-50 rounded-2xl border border-dashed border-saffron-300">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Cover Image</label>
                            <input type="file" accept="image/*" onChange={e => setBookCover(e.target.files[0])} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-white file:text-maroon-900 file:border file:border-maroon-900"/>
                         </div>
                         <div className="p-6 bg-sand-50 rounded-2xl border border-dashed border-saffron-300">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">PDF Scripture</label>
                            <input type="file" accept="application/pdf" onChange={e => setBookPdf(e.target.files[0])} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-white file:text-red-700 file:border file:border-red-700"/>
                         </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-saffron-500 to-maroon-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition">
                         Upload to Library
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}