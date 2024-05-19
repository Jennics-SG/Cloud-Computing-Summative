/** Name:   WaglyJs.backend.main.js
 *  Desc:   Main script for WaglyJs backend
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const express = require('express');
const cookie = require('cookie-parser')
const path = require('path');
const favicon = require('serve-favicon');
const Router = require('./backened/router');
const Database = require('./backened/database/database');

// Class containing server code
class Server{
    // Initalise Server
    constructor(){
        // Get environment variables
        require('dotenv').config();
        
        // Create express application
        this.app = express();
        this.hostName = process.env.HOST_NAME || "localHost";
        this.port = process.env.PORT || "8080"

        // Set rendering engine to EJS
        this.app.set('view engine', 'ejs');
        this.app.use(cookie())

        // Favicon Middleware
        this.app.use(favicon(path.join(__dirname, '/static/favicon.ico')));

        // JSON middleware
        this.app.use(express.json());

        // Initialise router and call runtime
        this.router = new Router(this.app);
        this.runtime();
    }

    // Server runtime
    runtime(){
        // Establish Database Connection
        Database.manager.connect();

        // Set server to liten on port
        this.app.listen(this.port, _=> {
            console.log(
                `Server Started \nConnect too ${this.hostName}:${this.port}`
            );
        });
    }
}

new Server();