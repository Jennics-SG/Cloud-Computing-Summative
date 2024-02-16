/** Name:   WaglyJs.backend.router.js
 *  Desc:   Router for WaglyJs
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const path = require('path');
const fs = require('fs');

const Database = require('./database/database')

const CreateAccount = require('./database/Auth/createAccount');
const VerifyLogin = require('./database/Auth/verifyLogin')
const AddPet = require('./database/addPet');
const AddJob = require('./database/addJob');
const Auth = require('./auth')
const JWT = require('./jwt')

require('dotenv');

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
            res.redirect('/lsu/signup');
        });

        this.app.get('/lsu', (req, res) => {
            res.redirect('/lsu/login');
        })

        this.app.get('/lsu/:display', (req, res) => {
            console.log('User connected to home');
            res.render('pages/lsu', {display: req.display});
        })

        this.app.get('/home', (req, res) => {
            res.redirect('/home/owner/findWalk');
        })

        this.app.get('/home/owner', (req, res) => {
            res.redirect('/home/owner/findWalk')
        })

        this.app.get('/home/owner/findWalk', Auth.verify, (req, res) => {
            console.log(req.userData);
            res.render('pages/findWalker')
        })

        this.app.get('/home/owner/pets', Auth.verify, (req, res) => {
            res.render('pages/pets');
        })
        
        this.app.get('/home/walker', Auth.verify, (req, res) =>{
            res.render('pages/walker');
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
            const credData = await login.verify();

            // If no account found return
            if(!credData){
                console.log('Account not found');
                res.sendStatus(404)
                return;
            }

            // Get account
            const accountData = await Database.manager.getAccount(credData.uuid);

            // Send account ID to frontend
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify({ID: accountData.uuid, actType: accountData.actType}));;

            return;
        });

        // Return account type
        this.app.post('/api/ownerwalker', async (req, res) => {
            const data = req.body;

            const act = await Database.manager.getAccount(data.userid);

            res.set('Content-Type', 'application/JSON')
            res.send(JSON.stringify(act.actType))
        })

        // Add a pet to the database
        this.app.post('/api/addPet', async (req, res) => {
            const data = req.body;

            const pet = new AddPet(data);
            const petID = await pet.save();
        
            // If pet add was unseccessful respond 503
            if(!petID){
                res.sendStatus(503);
                return;
            }

            res.sendStatus(200);
        })

        // Return pets registered to User
        this.app.post('/api/getPets', async (req, res) => {
            const data = req.body;

            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getPets(data.userid)))
        });

        // Get list of walkers
        this.app.post('/api/getWalkers', async (req, res) => {
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getWalkers()));
        });

        // Ofer job from owner to walker
        this.app.post('/api/offerJob', async (req, res) => {
            const data = req.body;

            const job = new AddJob(data);
            job.save();
        });

        // Get jobs linked to user
        this.app.post('/api/getJobs', async (req, res) => {
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getWalkerJobs(req.body.userID)));
        });

        // Gets details important to job from user
        // Such as amount of pets registered & largest dog
        this.app.post('/api/getJobDetails', async (req, res) => {
            const data = req.body;

            const owner = await Database.manager.getAccount(data.ownerID);

            const pets = await Database.manager.getPets(data.ownerID);
            
            // Get largest pet registered to user
            let largest = 0;

            pets.forEach((pet) => {
                // No need to check for largest if its already set
                if(largest == 3) return

                // change letter code for number
                if(pet.size == "s") pet.size = 1;
                if(pet.size == "m") pet.size = 2;
                if(pet.size == "l") pet.size = 3;

                if(largest < pet.size) largest = pet.size;
            });

            // Change largest back to letter
            const sizes = ["s", "m", "l"];
            largest = sizes[largest - 1];

            const jobDetails = {
                name: owner.name,
                pets: pets.length,
                largest: largest
            }

            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(jobDetails));
        });

        this.app.post('/api/acceptJob', async (req, res) => {
            const data = req.body;
            
            // Find job
            const job = await Database.manager.getJob(data.userID, data.ownerID);
            
            // set accepted to true
            job.accepted = true;

            // Save job
            await job.save();
            res.sendStatus(200);
        });

        // Remove job from db
        this.app.post('/api/removeJob', async (req, res) => {
            const data = req.body;

            await Database.manager.removeJob(data.userID, data.walkerID);

            res.sendStatus(200);
        })

        this.app.post('/api/createTokens', async (req, res) => {
            const data = req.body;
            const access = await JWT.createToken(
                process.env.ACCESS_SECRET, data, '1h'
            );
            const refresh = await JWT.createToken(
                process.env.REFRESH_SECRET, data, '1d'
            );

            // Store refresh in database
            const cred = await Database.manager.getCred(data.userData.ID);
            cred.refresh = refresh;
            await cred.save();

            // Add refresh too cookies
            res.set('Content-Type', 'application/JSON')
            res.cookie('jwt', refresh, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000
                }
            );
            res.send(JSON.stringify(access))
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