const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const documentRoutes = require('./api/routes/documents');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://ocrniv:' +
 process.env.MONGO_ATLAS_PW +
  '@node-rest-ocr-v6mz4.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    }
);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/results', express.static('results'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Adding headers for response and request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/documents', documentRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);    
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;