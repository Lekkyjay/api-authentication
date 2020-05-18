const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', require('./routes/users'));


app.listen(port, function(){
    console.log("Server running on localhost:" + port);
});