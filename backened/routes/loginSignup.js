/** Name:   WaglyJs.backend.router.loginSignup.js
 *  Desc:   Routes for login signup pages
 *  Author: Jimy Houlbrook
 *  Date:   04/03/24
 */

const express = require('express');

// Class to act as wrapper for code
class LSURoutes{
    // Initialise router
    constructor(){
        this.router = express.Router();
        this.initRoutes();
    }

    // Initialise routes
    // Base route is '/lsu'
    initRoutes(){
        // Display used to know if displaying login  or signup page
        this.router.get('/(:display)?', (req, res) => {
            console.log('User connected to LSU');

            const display = req.params.display == undefined ?
                "login" : req.params.display;
            
            console.log(display);

            // Render login page if not specified
            res.render('pages/lsu', {display});
        });
    }
}

module.exports = new LSURoutes;