const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

const app = express();

//Middlewares
app.use(morgan('dev'));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/users', require('./routes/users'));


app.listen(port, function(){
    console.log("Server running on localhost:" + port);
});