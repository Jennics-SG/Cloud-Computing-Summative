const path = require('path');
const fs = require('fs');

class Router{
    // Router for the express application
    constructor(app){
        this.app = app;
        this.routes = {
            get: this.routeGet,
            post: this.routePost
        }
    }

    routeGet(){
        this.app.get('/', (req, res) => {
            console.log('user connecting to home')
            res.render('pages/home', {user: null});
        })

        this.sendDir(path.join(__dirname, '../static'));
    }
    routePost(){}

    // Send all files in a directory
    // does NOT send subdirectories
    sendDir(dir){
        if(!dir)
        return;

        const files = fs.readdirSync(dir);

        for(const file of files){
            this.app.get(`/static/${file}`, (req, res) => {
                res.sendFile(path.join(dir, `${file}`));
            });
        }
        console.log(this.app._router.stack);
    }
}

module.exports = Router;