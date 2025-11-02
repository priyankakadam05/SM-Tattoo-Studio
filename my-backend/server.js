// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000; // Changed from 3000 to 4000

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smtattoo';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    // Start server only after successful database connection
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Visit: http://localhost:${PORT}`);
        console.log(`📊 MongoDB Status: Connected`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
});

// Add connection error handler
mongoose.connection.on('error', err => {
    console.error('🔥 MongoDB connection error:', err.message);
});

// Add disconnection handler
mongoose.connection.on('disconnected', () => {
    console.log('❌ MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during MongoDB disconnect:', err);
        process.exit(1);
    }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    service: {
        type: String,
        enum: ['', 'custom', 'cover-up', 'piercing', 'home-service', 'consultation', 'other'],
        default: ''
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: 2000
    },
    ipAddress: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const Contact = mongoose.model('Contact', contactSchema);

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Rate limiting middleware
const rateLimit = new Map();

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5; // 5 requests per window
    
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, startTime: now });
    } else {
        const window = rateLimit.get(ip);
        
        if (now - window.startTime > windowMs) {
            // Reset for new window
            rateLimit.set(ip, { count: 1, startTime: now });
        } else {
            window.count++;
            
            if (window.count > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many requests. Please try again later.'
                });
            }
        }
    }
    
    next();
};

// Contact form endpoint
app.post('/api/contact', rateLimitMiddleware, async (req, res) => {
    try {
        const { name, email, phone, service, message, website } = req.body;

        // Honeypot check
        if (website) {
            return res.status(400).json({
                success: false,
                message: 'Invalid submission.'
            });
        }

        // Validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
        }

        // Save to MongoDB
        const contactSubmission = new Contact({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            service: service || '',
            message: message.trim(),
            ipAddress: req.ip || req.connection.remoteAddress
        });

        const savedSubmission = await contactSubmission.save();
        console.log('✅ Contact form saved to MongoDB:', savedSubmission._id);

        // Send email notification
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || 'contact@smtattoostudio.com',
                subject: 'New Contact Form Submission - SM Tattoo Studio',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #D4AF37; color: #000; padding: 20px; text-align: center;">
                            <h1>SM Tattoo Studio - New Contact Form</h1>
                        </div>
                        <div style="background: #f9f9f9; padding: 20px;">
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Name:</strong> ${name}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Email:</strong> ${email}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Phone:</strong> ${phone}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Service:</strong> ${service || 'Not specified'}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Message:</strong><br>
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Submission ID:</strong> ${savedSubmission._id}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #D4AF37;">Submitted:</strong> ${new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ Email notification sent');
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            submissionId: savedSubmission._id
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your request. Please try again later.'
        });
    }
});

// Booking form endpoint
app.post('/api/booking', rateLimitMiddleware, async (req, res) => {
    try {
        const { name, email, tattooType, date, time, message, website } = req.body;

        // Honeypot check
        if (website) {
            return res.status(400).json({ success: false, message: 'Invalid submission.' });
        }

        // Basic validation
        if (!name || !email || !tattooType || !date || !time) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }

        // Email validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }

        // Save to DB
        const booking = new Booking({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            tattooType,
            date,
            time,
            message: message ? message.trim() : '',
            ipAddress: req.ip
        });

        const saved = await booking.save();
        console.log("✅ Booking saved:", saved._id);

        // Send email to admin
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: 'New Tattoo Booking Request',
                html: `
                <h2>New Booking Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Tattoo Type:</strong> ${tattooType}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>ID:</strong> ${saved._id}</p>
                `
            });
            console.log("✅ Booking email sent");
        } catch (err) {
            console.error("❌ Email error:", err);
        }

        res.json({
            success: true,
            message: 'Booking request received! We will confirm shortly.',
            bookingId: saved._id
        });

    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Try again later.'
        });
    }
});


// Booking Schema

/*const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    tattooType: {
        type: String,
        enum: ['custom', 'cover-up', 'piercing', 'home-service'],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['new', 'confirmed', 'cancelled'],
        default: 'new'
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);*/


// Admin API to get all submissions (optional - for admin panel)
app.get('/api/admin/submissions', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const submissions = await Contact.find()
            .sort({ createdAt: -1 })
            .select('-__v')
            .limit(100);

        res.json({
            success: true,
            data: submissions,
            count: submissions.length
        });
    } catch (error) {
        console.error('❌ Admin submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions'
        });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check database connection
        await mongoose.connection.db.admin().ping();
        
        res.json({
            success: true,
            message: 'Server is healthy',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server health check failed',
            database: 'Disconnected',
            error: error.message
        });
    }
});

// Serve HTML files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

