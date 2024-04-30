/** Name:   WaglyJs.backend.router.owner.js
 *  Desc:   Routes for owner pages
 *  Author: Jimy Houlbrook
 *  Date:   14/03/24
 */

const express = require('express');

class OwnerRoutes{
    // Initialise Router
    constructor(){
        this.router = express.router();
        this._initRoutes();
    }

    // Initialise routes
    // Base route is '/owner'
    _initRoutes(){
        // redirect user to home page
        this.router.get('/', (req, res) => {
            res.redirect('/owner/pets');
        });

        // Pets page
        this.router.get('/pets', (req, res) => {
            res.render('pages/pets');
        });

        // Find walker page
        this.router.get('findWalk', (req, res)  => {
            res.render('pages/findWalker');
        });
    }
}

module.exports = new OwnerRoutes;