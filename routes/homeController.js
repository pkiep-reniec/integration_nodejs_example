/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

let controller = {
    getIndex: (req, res, next) => {
        return res.render('home', {user: req.session.user});
    }
};

module.exports = controller;