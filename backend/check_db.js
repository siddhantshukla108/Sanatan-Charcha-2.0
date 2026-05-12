const mongoose = require('mongoose');
require('dotenv').config();

async function checkDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/my_blog_db');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check Post count
    const Post = mongoose.model('Post', new mongoose.Schema({}));
    const count = await Post.countDocuments();
    console.log('Total Blog Posts:', count);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDb();
