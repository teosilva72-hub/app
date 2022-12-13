const express = require('express');
require('dotenv/config');
const app = express();
const PORT = process.env.PORT || 8005

app.listen(PORT, (error)=>{
    if(error) console.log('server Error', PORT);
    else console.log('server listen on port', PORT);
});

module.exports = app;

require('./component');