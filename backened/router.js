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

        this.app.get('/home', (req, res) => {
            res.redirect('/home/signup');
        })

        this.app.get('/home/:display', (req, res) => {
            console.log('User connected to home');
            res.render('pages/home', {display: req.display});
        })

        // Send directories with files
        this.sendDir(path.join(__dirname, '../static'));
        this.sendDir(path.join(__dirname, '../src'));
    }

    // All post routes
    routePost(){
        // Sign user up to database
        this.app.post('/newuser', async (req, res) => {
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

            // Redirect user to userhome if acc made
            console.log('User Saved', accountID);
            res.sendStatus(200);
            return;
        });

        // Log user in to service
        this.app.post('/userlogin', async (req, res) => {
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

            // Redirect user to userhome if acc found
            console.log('Account Found', accountID);
            res.sendStatus(200);
            return;
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