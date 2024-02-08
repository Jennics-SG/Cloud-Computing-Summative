const express = require('express');
const path = require('path');
// const colours = require('./dev_tools/consoleColours');
const Router = require('./backend/router');
const favicon = require('serve-favicon');

class Server{
    // Initalise Server
    constructor(){
        // Get environment variables
        require('dotenv').config();
        
        // Create express application
        this.app = express();
        this.hostName = process.env.HOST_NAME || "localHost";
        this.port = process.env.port || "8080"

        // Set rendering engine to EJS
        this.app.set('view engine', 'ejs');

        this.app.use(favicon(path.join(__dirname, '/static/favicon.ico')));

        // Initialise router and call runtime
        this.router = new Router(this.app);
        this.runtime();
    }

    // Server runtime
    runtime(){
        // Call routes for server
        this.router.routes.get.bind(this.router)();
        this.router.routes.post.bind(this.router)();

        // Set server to liten on port
        this.app.listen(this.port, _=> {
            console.log(
                `Server Started \nConnect too ${this.hostName}:${this.port}`
            );
        });
    }
}

new Server();