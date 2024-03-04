/** Name:   WaglyJs.backend.router.owner.js
 *  Desc:   Routes for owner pages
 *  Author: Jimy Houlbrook
 *  Date:   04/03/24
 */

const express = require('express');

// Class to act as wrapper for code
class OwnerRoutes{
    constructor(){
        this.router = express.Router();
        this.initRoutes();
    }

    // Initialise routes
    // Base route is '/owner'
    initRoutes(){
        // Redirect user to home page
        this.router.get('/', (req, res) => {
            res.redirect('/owner/pets');
        });

        // Pets page
        this.router.get('/pets', (req, res) => {
            res.render('pages/pets');
        });

        // Find walker page
        this.router.get('/findWalk', (req, res) => {
            res.render('pages/findWalker');
        });
    }
}

module.exports = new OwnerRoutes;