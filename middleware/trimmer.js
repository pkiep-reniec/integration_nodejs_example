/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const _ = require('underscore');

module.exports = (req, res, next) => {
    let exclude = [
        'password',
    ];

    let convertInt = (value) => {
        if (!isNaN(value)) {
            return parseInt(value);
        }

        return value;
    };

    switch (req.method) {
        case 'POST':
            req.body = _.object(_.map(req.body, function (value, key) {
                if (exclude.indexOf(key) == -1) {
                    return [key, convertInt(value.trim())];
                } else {
                    return [key, value];
                }
            }));
            break;

        case 'GET':
            req.query = _.object(_.map(req.query, function (value, key) {
                if (exclude.indexOf(key) == -1) {
                    return [key, convertInt(value.trim())];
                } else {
                    return [key, value];
                }
            }));
            break;
    }

    next();
};