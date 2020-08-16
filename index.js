'use strict'

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv/config');

const app = express();

// Connect To DB
let port = process.env.PORT;
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(() => {
    console.log("Connected to DB!");
    app.listen(port, () => {
        console.log("Server running at localhost:"+port);
    })
}).catch(err => console.log(err));


// Routing Files
const userRouter = require('./core/routes/user.route');

// Middlewares
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(express.json());

// Cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Routes
 app.use('/api', userRouter);


// Export
module.exports = app;