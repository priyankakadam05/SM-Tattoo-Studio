// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('🔗 Testing MongoDB Atlas connection...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB Atlas connection successful!');
        
        // Test if we can create and save a document
        const TestModel = mongoose.model('Test', {
            name: String,
            timestamp: { type: Date, default: Date.now }
        });
        
        const testDoc = new TestModel({ name: 'Connection Test' });
        await testDoc.save();
        console.log('✅ Database write test passed!');
        
        // Clean up
        await TestModel.deleteOne({ _id: testDoc._id });
        console.log('✅ Database cleanup completed!');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed gracefully.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('💡 Troubleshooting tips:');
        console.log('1. Check your MONGODB_URI in .env file');
        console.log('2. Verify your MongoDB Atlas IP whitelist');
        console.log('3. Check your database user credentials');
        process.exit(1);
    }
}

testConnection()