require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret — MUST be set in .env, no insecure fallback
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware — CORS restricted to frontend origin
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://sanatan-charcha.vercel.app'
];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/my_blog_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB Connection Error. Starting server without DB to avoid crash.');
    console.error(err.message);
  });

// --- MODELS ---

// 1. Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// 1.5 User Model (Regular Users)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google Auth
  googleId: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 2. Post Model (Blog)
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  mediaUrl: String, // Path to image/video
  mediaType: String, // 'image' or 'video'
  createdBy: String, // Admin email
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// 3. Book Model (Library) -- NEW
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  language: { type: String, default: 'Hindi' }, // e.g., Hindi, Sanskrit, English
  coverUrl: String, // Path to book cover image
  pdfUrl: String,   // Path to the actual PDF file
  uploadedBy: String, // Admin email
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', bookSchema);

// --- SEED ADMINS (Run once on startup) ---
const seedAdmins = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASS) {
    console.warn('WARN: ADMIN_EMAIL or ADMIN_PASS not set in .env. Skipping admin seeding.');
    return;
  }
  
  const admins = [
    { 
      email: process.env.ADMIN_EMAIL, 
      password: process.env.ADMIN_PASS 
    }
  ];

  for (let admin of admins) {
    const exists = await Admin.findOne({ email: admin.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await Admin.create({ email: admin.email, password: hashedPassword });
      console.log(`Admin created: ${admin.email}`);
    }
  }
};
seedAdmins();

// --- FILE UPLOAD CONFIG (Multer) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Clean filename to prevent issues
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + cleanName);
  }
});

// Filter: Accept Images (Blog/Covers) AND PDFs (Books)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'video/mp4', 
    'application/pdf'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Images, MP4 Videos, and PDFs are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

// --- AUTH MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided or invalid format. Use Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

// --- RATE LIMITERS ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many login attempts, please try again later.' }
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many submissions, please try again later.' }
});

const discussionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { message: 'You are sending messages too quickly. Please wait a moment.' }
});

// --- ROUTES ---

// === AUTH ROUTES ===

// Unified Login Route (Checks Admin first, then User)
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if Admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, email: admin.email, role: 'admin', name: 'Admin' });
    }

    // 2. Check if User
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(404).json({ message: 'User not found or uses Google Auth' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, email: user.email, role: 'user', name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Registration Route
app.post('/api/auth/register', formLimiter, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, email: newUser.email, role: 'user', name: newUser.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth Login/Registration
app.post('/api/auth/google', loginLimiter, async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Missing credential' });
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if it's an admin logging in via Google
    const admin = await Admin.findOne({ email });
    if (admin) {
      const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, email: admin.email, role: 'admin', name: 'Admin' });
    }

    // Check existing user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = await User.create({ name, email, googleId });
    } else if (!user.googleId) {
      // Link Google ID to existing email user
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, email: user.email, role: 'user', name: user.name });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
});

// === BLOG ROUTES ===

// Get All Posts
app.get('/api/content', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Blog Post
app.post('/api/admin/upload', verifyToken, upload.single('media'), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    let mediaUrl = '';
    let mediaType = '';

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    const newPost = new Post({
      title,
      excerpt,
      content,
      mediaUrl,
      mediaType,
      createdBy: req.user.email
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Blog Post
app.put('/api/admin/edit/:id', verifyToken, upload.single('media'), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const updateData = { title, excerpt, content };

    if (req.file) {
      updateData.mediaUrl = `/uploads/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Post updated', post: updatedPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog Post (with file cleanup)
app.delete('/api/admin/delete/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Clean up uploaded media file
    if (post.mediaUrl) {
      const filePath = path.join(__dirname, post.mediaUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === LIBRARY ROUTES (NEW) ===

// 1. Get All Books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Upload Book (Requires 'cover' and 'pdf' files)
app.post('/api/books/upload', verifyToken, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, author, description, language } = req.body;

    // Validation: Check if both files are uploaded
    if (!req.files || !req.files['cover'] || !req.files['pdf']) {
      return res.status(400).json({ message: 'Both Cover Image and PDF file are required.' });
    }

    const newBook = new Book({
      title,
      author,
      description,
      language,
      coverUrl: `/uploads/${req.files['cover'][0].filename}`,
      pdfUrl: `/uploads/${req.files['pdf'][0].filename}`,
      uploadedBy: req.user.email
    });

    await newBook.save();
    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete Book
app.delete('/api/books/delete/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Clean up physical files to save disk space
    if (book.coverUrl) {
      const coverPath = path.join(__dirname, book.coverUrl);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }
    if (book.pdfUrl) {
      const pdfPath = path.join(__dirname, book.pdfUrl);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Message Model & Route (Add to server.js) ---
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.json({ success: true, message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Messages (Protected - Admin only)
app.get('/api/contact', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === ARTICLE REQUEST MODEL & ROUTES ===

const articleRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  topic: { type: String, required: true },
  description: String,
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'published'], default: 'pending' },
  adminNote: String,
  createdAt: { type: Date, default: Date.now }
});
const ArticleRequest = mongoose.model('ArticleRequest', articleRequestSchema);

// Public: Submit a new article request
app.post('/api/requests', formLimiter, async (req, res) => {
  try {
    const { requesterName, requesterEmail, topic, description, category } = req.body;
    if (!requesterName || !requesterEmail || !topic) {
      return res.status(400).json({ message: 'Name, email and topic are required.' });
    }
    const newRequest = await ArticleRequest.create({ requesterName, requesterEmail, topic, description, category });
    res.status(201).json({ message: 'Request submitted successfully!', request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get approved/published requests (Community Wishlist)
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await ArticleRequest.find({ status: { $in: ['approved', 'published'] } }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get ALL requests
app.get('/api/requests/all', verifyToken, async (req, res) => {
  try {
    const requests = await ArticleRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update request status/note
app.put('/api/requests/:id', verifyToken, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const updated = await ArticleRequest.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request updated', request: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete a request
app.delete('/api/requests/:id', verifyToken, async (req, res) => {
  try {
    await ArticleRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === DISCUSSION SYSTEM (Discord-like channels) ===

const discussionMessageSchema = new mongoose.Schema({
  channel: { type: String, required: true },        // Channel name/slug e.g. 'vedas', 'general'
  userName: { type: String, required: true },
  userColor: { type: String, default: '#ff8f2b' },   // Display color for username
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const DiscussionMessage = mongoose.model('DiscussionMessage', discussionMessageSchema);

// Get messages for a channel (public, paginated)
app.get('/api/discussion/:channel', async (req, res) => {
  try {
    const { channel } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before; // For pagination: messages before this timestamp
    
    const query = { channel };
    if (before) query.createdAt = { $lt: new Date(before) };
    
    const messages = await DiscussionMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(messages.reverse()); // Return in chronological order
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a message to a channel (public — anyone can join with a display name)
app.post('/api/discussion/:channel', discussionLimiter, async (req, res) => {
  try {
    const { channel } = req.params;
    const { userName, userColor, message } = req.body;
    
    if (!userName || !message) {
      return res.status(400).json({ message: 'Username and message are required.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ message: 'Message too long (max 1000 chars).' });
    }
    
    const newMsg = await DiscussionMessage.create({ channel, userName, userColor, message });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete a discussion message
app.delete('/api/discussion/message/:id', verifyToken, async (req, res) => {
  try {
    await DiscussionMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get channel stats (message count per channel)
app.get('/api/discussion-stats', async (req, res) => {
  try {
    const stats = await DiscussionMessage.aggregate([
      { $group: { _id: '$channel', count: { $sum: 1 }, lastMessage: { $max: '$createdAt' } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max size is 50MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));