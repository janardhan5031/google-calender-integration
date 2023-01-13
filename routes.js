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
            oauth2Client.setCredentials(response.tokens);
            // oauth2Client.setCredentials(tokens);
            
            userCredential = response.tokens;
            console.log(userCredential)

            // getting the top 10 events form user's calender list
            const calendar = google.calendar('v3');
            const responseData = await calendar.events.list({
                auth: oauth2Client,
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });
            const events = responseData.data.items;
            if (!events || events.length === 0) {
                console.log('No upcoming events found.');
                res.send('there is no events in your calender')
            }
            else {

                console.log('Upcoming 10 events:');
                const list = events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                    return `${start} - ${event.summary}`
                });

                res.status(200).json({eventsList:list})
            }

        }

    } catch (err) {
        console.log(err)
        res.status(401).send(err)

    }


})


module.exports = Router;