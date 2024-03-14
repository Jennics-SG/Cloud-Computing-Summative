/** Name:   WaglyJs.backend.router.loginSignup.js
 *  Desc:   Routes for login signup page
 *  Author: Jimy Houlbrook
 *  Date:   14/03/24
 */

const express = require('express');

class LSURoutes{
    // Iniitialise Router
    constructor(){
        this.router = express.Router();
        this._initRoutes();
    }

    // Iniitialise Routes
    // Base route is /lsu
    _initRoutes(){
        // Display is uised to know of dosplaying login or signup tab
        this.router.get('/(:display)?', (req, res) => {
            console.log('User connected to LSU');

            const display = req.params.display;

            // If display is not a valid option make it login
            if(display != "login" || display != "signup") display = "login";

            res.render('pages/lsu', { display });
        });
    }
}

module.exports = new LSURoutes;