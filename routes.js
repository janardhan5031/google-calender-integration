const express = require('express');
const Router = express.Router();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    '669853299274-h416ojaiqe9pultijrefvgfqk4buos0j.apps.googleusercontent.com',
    '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',
    'http://localhost:5000/calender/redirect'
);

// Access scopes for read-only Drive activity.
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

// Generate a url that asks permissions for the Drive activity scope
const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
});
let userCredential = null;

Router.get('/init', async (req, res, next) => {

    res.writeHead(301, { "Location": authorizationUrl });
    res.end();

})

Router.get('/redirect', async (req, res) => {
    const query = req.query;

    try {
        if (query.error) { // An error response e.g. error=access_denied
            throw new Error(query.error)
        }
        else { // Get access and refresh tokens (if access_type is offline)
            const response = await oauth2Client.getToken(query.code);
            // oauth2Client.setCredentials(tokens);

            userCredential = response.tokens;
            res.send('successfully signed in')
        }

    } catch (err) {
        console.log(err)
        res.status(401).send(err)

    }

    console.log(userCredential)

})


module.exports = Router;