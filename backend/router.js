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
            // TODO Use cookie to tell if user has account
            res.redirect('/home/signup');
        });

        this.app.get('/home', (req, res) => {
            res.redirect('/home/signup');
        })

        this.app.get('/home/:display', (req, res) => {
            console.log('User connected to home');
            res.render('pages/home', {display: req.display});
        })

        this.sendDir(path.join(__dirname, '../static'));
        this.sendDir(path.join(__dirname, '../src'));
    }
    routePost(){
        this.app.post('/newuser', (req, res) => {
            console.log(req.body);
            res.sendStatus(200);

            // TODO: Respond invalid status when error
        })

        this.app.post('/userlogin', (req, res) => {
            console.log(req.body);
            res.sendStatus(200);

            // TODO: Respons invalid status when error
        })
    }

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
    }
}

module.exports = Router;