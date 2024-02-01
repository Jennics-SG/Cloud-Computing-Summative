const express = require('express');
const colours = require('./dev_tools/consoleColours');
const Router = require('./backend/router');

class Server{
    // Initalise Server
    constructor(){
        // Get environment variables
        require('dotenv').config();
        
        // Create express application
        this.app = express();
        this.hostName = process.env.HOST_NAME;
        this.port = process.env.port

        // Set rendering engine to EJS
        this.app.set('view engine', 'ejs');

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
            console.log(colours.foregroud.green,
                `Server Started \nConnect too ${this.hostName}:${this.port}`);
        });
    }
}

new Server();