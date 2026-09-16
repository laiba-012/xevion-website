const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createInstructor = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberion');
    console.log('✅ Connected to MongoDB');

    // Check if instructor already exists
    const existingUser = await User.findOne({ email: 'instructor@cyberion.io' });
    
    if (existingUser) {
      console.log('⚠️ Instructor already exists, updating password...');
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('instructor123', salt);
      
      // Update password only (don't touch badges)
      existingUser.password = hashedPassword;
      existingUser.role = 'instructor';
      await existingUser.save();
      
      console.log('✅ Password updated successfully!');
    } else {
      console.log('📝 Creating new instructor...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('instructor123', salt);
      
      // Create new instructor with proper badges format
      const user = await User.create({
        name: 'Instructor',
        email: 'instructor@cyberion.io',
        password: hashedPassword,
        role: 'instructor',
        xp: 3000,
        level: 4,
        badges: [
          { name: 'Instructor', icon: '🎓' },
          { name: 'Expert', icon: '⭐' }
        ],
        isPremium: true
      });
      
      console.log('✅ Instructor created successfully!');
    }
    
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('│ Email: instructor@cyberion.io');
    console.log('│ Password: instructor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  }
};

createInstructor();