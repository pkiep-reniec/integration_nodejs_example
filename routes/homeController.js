/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const config = require('./../config/config.json');
const reniecIdaas = require('reniec-idaas');

let controller = {
    getIndex: (req, res, next) => {
        return res.render('home', {user: req.session.user});
    },

    getLogout: (req, res, next) => {
        let logoutUri = reniecIdaas.getLogoutUri(config.app.baseUrl);
        return res.redirect(logoutUri);
    }
};

module.exports = controller;