/** Name:   WaglyJs.backend.router.static.js
 *  Desc:   Routes for static files
 *  Author: Jimy Houlbrook
 *  Date:   04/03/24
 */

const path = require('path');
const fs = require('fs');
const express = require('express');

// Class to act a wrapper for code
class StaticRoutes{
    constructor(){
        this.router = express.Router();
        this.initRoutes();
    }

    // Initialise routes
    // Base route is '/static'
    initRoutes(){
        this.sendDir(path.join(__dirname, '../../static'));
        this.sendDir(path.join(__dirname, '../../src'));
    }

    // Send all files in a directory
    // does NOT send subdirectories
    sendDir(dir){
        if(!dir)
        return;

        const files = fs.readdirSync(dir);

        for(const file of files){
            this.router.get(`/${file}`, (req, res) => {
                res.sendFile(path.join(dir, `${file}`));
            });
        }
    }
}

module.exports = new StaticRoutes;