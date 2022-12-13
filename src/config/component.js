;
const app = require('./server');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('../routes/all');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
app.use(cors());
app.use(morgan('combined')); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.set('views', path.join(__dirname, "../views/pages"));
app.use(express.static(path.join(__dirname, "../views/src")));
app.use(express.static(path.join(__dirname, "../../node_modules/")));
app.set('view engine', 'ejs');

app.use(routes);

module.exports = app;