/** Name:   WaglyJs.backend.router.static.js
 *  Desc:   Routes for static files
 *  Author: Jimy Houlbrook
 *  Date:   14/03/24
 */

const path = require('path');
const fs = require('fs');
const express = require('express');

class StaticRoutes{
    // Initialise Router
    constructor(){
        this.router = express.Router();
        this._initRoutes();
    }

    // Initialise Routes
    _initRoutes(){
        this._sendDir(path.join(__dirname, '../../static'));
        this._sendDir(path.join(__dirname, '../../src'));
    }

    // Send all files in directory
    // does not handle subdirectories
    _sendDir(_dir){
        if(!_dir) return;

        const _files  = fs.readdirSync(_dir);

        for(const _file of _files){
            this.router.get(`/${_file}`, (req, res) => {
                res.sendFile(path.join(_dir, _file));
            });
        }
    }
}