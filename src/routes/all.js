const express = require('express');
const controllerLogin = require('../controller/loginController');
const controllerIndex = require('../controller/indexController');
const controllerProduto = require('../controller/produtos');
const routes = new express.Router();

routes.get('/login', controllerLogin.login);
routes.get('/logout', controllerLogin.logout);
routes.post('/login', controllerLogin.postLogin);
routes.get('/produtos', controllerProduto.produtos);

routes.get('/', controllerIndex.index);

module.exports = routes;