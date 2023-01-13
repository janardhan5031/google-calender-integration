const express = require('express');

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const url = require('url');

const Router = express.Router();

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
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true
});
console.log('=====>', authorizationUrl);
let userCredential = null;

Router.get('/', async (req, res, next) => {



    async function main(req, res) {

        console.log('redirect user to auth page', req.url)

        res.writeHead(301, { "Location": authorizationUrl });
        res.end();
       
    }
    main(req, res).then().catch(console.error);
})

Router.get('/calender/redirect', async (req, res) => {
    const query = req.query;
    console.log(query)
    console.log(query.code)

    try {
        if (query.error) { // An error response e.g. error=access_denied
            console.log('Error:' + query.error);
        } else { // Get access and refresh tokens (if access_type is offline)
            let response = await oauth2Client.getToken(query.code);
            // oauth2Client.setCredentials(tokens);

            // console.log('response ===> ', response)
            userCredential = response.tokens;
        }

    } catch (err) {
        console.log(err)
    }


    console.log(userCredential)
    res.send('successfully signed in')

})

// Request details: redirect_uri=http://localhost:5000/calender/redirect


module.exports = Router;