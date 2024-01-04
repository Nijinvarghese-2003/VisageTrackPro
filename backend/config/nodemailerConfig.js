const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Create an OAuth2 client
const oauth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://developers.google.com/oauthplayground');

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN,
});

// Get an access token
const accessToken = oauth2Client.getAccessToken();

// Create Nodemailer transporter with OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: accessToken,
    },
});

module.exports = transporter;