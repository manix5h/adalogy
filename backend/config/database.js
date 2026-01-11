const mongoose = require('mongoose')



const connectDB = async () => {
  try {
    await mongoose.connect( 'mongodb+srv://manishsahu43962_db_user:YZRXnC6YOwUkS0aM@cluster0.oge5qn5.mongodb.net/logo' , {
     
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

