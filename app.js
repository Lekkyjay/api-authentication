const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, 
  {useNewUrlParser: true,  useUnifiedTopology: true})
  .then(() => { console.log('You are connected to MongoDB. Great!') })
  .catch((err) => { console.log('Connection failed...' + err) });

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', require('./routes/users'));

//Set listening port and start the server
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server running on localhost:" + port);
});