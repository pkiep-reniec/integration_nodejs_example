/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

let express = require('express');
let router = express.Router();
let loginController = require('./loginController');
let homeController = require('./homeController');

module.exports = () => {

    router.get('', (req, res, next) => {
        loginController.getIndex(req, res, next);
    });
    router.get('/auth-endpoint', (req, res, next) => {
        loginController.getAuthEndpoint(req, res, next);
    });
    router.get('/home', (req, res, next) => {
        homeController.getIndex(req, res, next);
    });

    return router;

};
