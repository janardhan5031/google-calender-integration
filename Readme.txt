
Here we use googleapis library to integrate into our application, where users can use their primary calendar defaultly 
every one have with their google account

initially we redirect the user to Oauth2 server for user Authentication with client credentials attched to the request 
by our server.

Aftert the user authentication, google will send the code by redirecting the user to a specified route descibed in the console.

then code sent by the google will be extracted to get the tokens and to understand the user authorized our 
server request.

( note: here i used to store the user token after authorization in a variable which is availabe all routes.
    but its not recomended for production. i just used to say, the way of google calender integration in our applicaton.

    all credentials are need to read from . env file to secure the credentials.
    but accidentally, i pushed the credentials to git. i will delete those credentials from google console. so they may not be work anymore. 
)


