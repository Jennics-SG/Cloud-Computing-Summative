/** Name:   WaglyJs.backend.router.js
 *  Desc:   Router for WaglyJs
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const path = require('path');
const fs = require('fs');

const CreateAccount = require('./database/Auth/createAccount');
const VerifyLogin = require('./database/Auth/verifyLogin')

// Router for the express application
class Router{
    constructor(app){
        this.app = app;

        // Object to hold the routing functions
        this.routes = {
            get: this.routeGet,
            post: this.routePost
        }
    }

    // All get routes
    routeGet(){
        // Home routes, redirect to /home/:display
        this.app.get('/', (req, res) => {
            // TODO Use cookie to tell if user has account
            res.redirect('/home/signup');
        });

        this.app.get('/lsu', (req, res) => {
            res.redirect('/home/signup');
        })

        this.app.get('/lsu/:display', (req, res) => {
            console.log('User connected to home');
            res.render('pages/lsu', {display: req.display});
        })

        this.app.get('/home', (req, res) => {
            res.render('pages/home');
        })

        // Send directories with files
        this.sendDir(path.join(__dirname, '../static'));
        this.sendDir(path.join(__dirname, '../src'));
    }

    // All post routes
    routePost(){
        // Sign user up to database
        this.app.post('/api/newuser', async (req, res) => {
            const data = req.body

            // Using await to make sure func finished before continuing
            const newUser = new CreateAccount(data);
            const accountID = await newUser.save();

            // Return if user not saved
            if(! accountID){
                // Uses 418 bcs teapot
                console.log('Error saving user');
                res.sendStatus(418);
                return;
            }

            // Send user ID to frontend
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ID: accountID}))
            return;
        });

        // Log user in to service
        this.app.post('/api/userlogin', async (req, res) => {
            const data = req.body;

            // Using await to make sure func finished before continuing
            const login = new VerifyLogin(data);
            const accountID = await login.verify();

            // If no account found return
            if(!accountID){
                console.log('Account not found');
                res.sendStatus(418)
                return;
            }

            // Send account ID to frontend
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify({ID: accountID}));;

            return;
        });
    
        this.app.post('/api/validateLocalAuth', async (req, res) => {
            const data = req.body;
            // Compare date to local date

            const dateNow = new Date();
            dateNow.setTime(dateNow.getTime());

            const authDate = new Date(data.expires)

            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(dateNow.getTime() < authDate.getTime()));
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