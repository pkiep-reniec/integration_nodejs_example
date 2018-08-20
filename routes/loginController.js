/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

let configAuth = require('./../config/reniec_idaas.json');
let config = require('./../config/config.json');
let randomstring = require('randomstring');
let reniecIdaas = require('reniec-idaas');

let controller = {
    getIndex: (req, res, next) => {
        req.session.state = randomstring.generate();
        setReniecIdaasConfig(req.session.state);

        return res.render('login', {url: reniecIdaas.getLoginUrl()});
    },

    getAuthEndpoint: async (req, res, next) => {
        if (req.query.error) {
            console.log(req.query.error + "\n" + req.query.error_description);
            return res.redirect(config.app.baseUrl);
        }

        if (req.session.state != req.query.state) {
            console.log("Wrong state");
            return res.redirect(config.app.baseUrl);
        }

        try {
            setReniecIdaasConfig(null);

            let tokens = await reniecIdaas.getTokens(req.query.code);

            if (tokens == null) {
                console.log("Error consuming token endpoint");
                return res.redirect(config.app.baseUrl);
            }

            let userInfo = await reniecIdaas.getUserInfo(tokens.access_token);

            if (tokens == null) {
                console.log("Error consuming userinfo endpoint");
                return res.redirect(config.app.baseUrl);
            }

            req.session.user = userInfo;
            req.session.logoutUri = reniecIdaas.getLogoutUri(config.app.baseUrl);

            return res.redirect(config.app.baseUrl + '/home');
        } catch (err) {
            console.log(err);
        }

        return res.redirect(config.app.baseUrl);
    }
};

function setReniecIdaasConfig(state) {
    reniecIdaas.setConfig({
        redirectUri: config.app.baseUrl + '/auth-endpoint',
        scopes: [
            reniecIdaas.constAuth.SCOPE_PROFILE,
            reniecIdaas.constAuth.SCOPE_EMAIL,
            reniecIdaas.constAuth.SCOPE_PHONE
        ],
        acr: reniecIdaas.constAuth.ACR_ONE_FACTOR,
        state: state,
        config: configAuth
    });
}

module.exports = controller;