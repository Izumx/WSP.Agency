const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from root

// --- SMTP Configuration (You must fill this in!) ---
// To use Gmail, you need an App Password: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // TODO: Replace with your Gmail
        pass: ''            // TODO: Replace with your App Password
    }
});

// In-memory "database" for demo purposes
const submissions = [];

// Helper to validate email
const isValidEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// API: Check status
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', message: 'WSP API is running' });
});

// API: Handle Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, service, message } = req.body;

    // Validation
    // Relaxed validation significantly since 'email' might now contain phone numbers
    if (!name || !email || !service || !message) {
        return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
    }

    // Save submission
    const newSubmission = {
        id: Date.now(),
        name,
        contact_info: email, // Mapped from 'email' key
        project: service,    // Mapped from 'service' key
        budget: message,     // Mapped from 'message' key
        timestamp: new Date()
    };

    submissions.push(newSubmission);
    console.log('New Contact Submission:', newSubmission);

    // --- Send Email ---
    const mailOptions = {
        from: `"WSP Website" <noreply@wsp.agency>`, // Fixed sender to avoid spoofing issues
        replyTo: email.includes('@') ? email : undefined,
        to: 'eskendir.bakhitzhanov@jihc.edu.kz',
        subject: `New Request from ${name}`,
        text: `
        New Project Request from WSP Agency Website:

Name: ${name}
Contact Info: ${email}
Project Description: ${service}
Budget: ${message}
`,
        html: `
    <h3>New Project Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact Info:</strong> ${email}</p>
        <p><strong>Project Description:</strong> ${service}</p>
        <p><strong>Budget:</strong> ${message}</p>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to eskendir.bakhitzhanov@jihc.edu.kz');

        res.status(200).json({
            success: true,
            message: 'Thank you! Your request has been emailed to our team.',
            data: newSubmission
        });
    } catch (error) {
        console.error('Error sending email:', error);
        // We still return success to the user so they don't think it failed, 
        // but we log the error on the server.
        // Or we could return an error if email is critical.
        // Let's return success but mentioned it was saved.
        res.status(200).json({
            success: true,
            message: 'Request saved! (Email delivery failed, check server logs).',
            data: newSubmission
        });
    }
});

// Fallback to index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`
    🚀 Server running on http://localhost:${PORT}
    -------------------------------------------
    - Serve Static: Enabled
    - API Status:   http://localhost:${PORT}/api/status
    - Contact API:  POST http://localhost:${PORT}/api/contact
    `);
});
