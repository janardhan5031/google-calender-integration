const express = require('express');
const Routes = require('./routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use( (req, res) => res.send('hii'));

app.use('/calender', Routes)


app.listen(5000);