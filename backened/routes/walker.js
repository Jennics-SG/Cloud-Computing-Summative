/** Name:   WaglyJs.backend.router.walker.js 
 *  Desc:   Routes for walker pages
 *  Author: Jimy Houlbrook
 *  Date:   04/03/24
 */

const express = require('express');

// Class to act as wrapper for code
class WalkerRoutes{
    constructor(){
        this.router = express.Router();
        this.initRoutes();
    }

    // Initialise routes
    // Base route is '/walker'
    initRoutes(){
        // Redirect users to home
        this.router.get('/', (req, res) => {
            res.redirect('/walker/home');
        });

        this.router .get('/home', (req, res) => {
            res.render('pages/walker');
        })
    }
}

module.exports = new WalkerRoutes;