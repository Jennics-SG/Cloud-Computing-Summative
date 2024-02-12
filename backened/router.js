const path = require('path');
const fs = require('fs');

const CreateAccount = require('./database/UserAuth/createAccount');
const VerifyLogin = require('./database/UserAuth/verifyLogin')

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
        this.app.post('/newuser', async (req, res) => {
            // Add account to database
            const data = req.body
            const newUser = new CreateAccount(data);

            if(await newUser.save()){
                console.log('User Saved');
                res.sendStatus(200);

                // Redirect to user home

                // Set newUser to null to make sure data is cleared
                newUser = null;
                return;
            }

            // Set newUser to null to make sure data is cleared
            newUser = null;

            // Uses 418 bcs teapot
            console.log('Error saving user');
            res.sendStatus(418);
            return;
        });

        this.app.post('/userlogin', async (req, res) => {
            const data = req.body;
            const login = new VerifyLogin(data);
            login.verify();
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

    // TEST FUNCTION TO PUT USER IN 
    // async addTestUser(){
    //     const data = {
    //         name: "hjhj",
    //         email: "email@email.com",
    //         pass: "pass",
    //         actType: "Owner"
    //     }

    //     const acc = new CreateAccount(data);
    //     await acc.save();
    // }
}

module.exports = Router;