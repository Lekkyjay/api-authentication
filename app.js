const express = require('express');
const morgan = require('morgan');

const port = 3000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from simple express server');
});

app.listen(port, function(){
    console.log("Server running on localhost:" + port);
});