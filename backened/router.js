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
const JWT = require('./jwt')

require('dotenv');

// Router for the express application
class Router{
    constructor(app){
        this.app = app;
        
        this.routeGet();
        this.routeApi();
        this.routeAuth();
    }

    // All get routes
    routeGet(){
        this.app.get('/', (req, res) => {
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

        this.app.get('/home/owner/findWalk', (req, res) => {
            res.render('pages/findWalker')
        })

        this.app.get('/home/owner/pets', (req, res) => {
            res.render('pages/pets');
        })
        
        this.app.get('/home/walker', (req, res) =>{
            res.render('pages/walker');
        })

        // Send directories with files
        this.sendDir(path.join(__dirname, '../static'));
        this.sendDir(path.join(__dirname, '../src'));
    }

    // API post routes
    routeApi(){
        // Return account type
        // Possibly redundant??
        this.app.post('/api/ownerwalker', async (req, res) => {
            const data = req.body;

            const act = await Database.manager.getAccount(data.userid);

            res.set('Content-Type', 'application/JSON')
            res.send(JSON.stringify(act.actType))
        })

        // Add a pet to the database
        this.app.post('/api/addPet', this.verifyAuth, async (req, res) => {
            const data = {...req.body, owner: req.userID};

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
        this.app.post('/api/getPets', this.verifyAuth, async (req, res) => {
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getPets(req.userID)))
        });

        // Get list of walkers
        this.app.post('/api/getWalkers', async (req, res) => {
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getWalkers()));
        });

        // Ofer job from owner to walker
        this.app.post('/api/offerJob', this.verifyAuth, async (req, res) => {
            const data = {...req.body, user: req.userID};

            const job = new AddJob(data);
            job.save();
        });

        // Get jobs linked to user
        this.app.post('/api/getJobs', this.verifyAuth, async (req, res) => {
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(await Database.manager.getWalkerJobs(req.userID)));
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

        // Accept an offered job
        this.app.post('/api/acceptJob', this.verifyAuth, async (req, res) => {
            const data = req.body;

            // Find job
            const job = await Database.manager.getJob(data.ownerID, req.userID);

            // set accepted to true
            job.accepted = true;

            // Save job
            await job.save();
            res.sendStatus(200);
        });

        // Remove job from db
        this.app.post('/api/removeJob', this.verifyAuth, async (req, res) => {            
            const data = req.body;

            await Database.manager.removeJob(data.owner, req.userID);

            res.sendStatus(200);
        });
    }

    // Auth routes
    routeAuth(){
        // Sign user up to database
        this.app.post('/auth/newuser', async (req, res) => {
            const data = req.body

            const newUser = new CreateAccount(data);
            const accountID = await newUser.save();

            // Return if user not saved
            if(!accountID){
                console.log('Error saving user');
                res.sendStatus(409);    // Conflict
                return;
            }

            // Send user ID to frontend
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ID: accountID}))
            return;
        });

        // Log user in to service
        this.app.post('/auth/userlogin', async (req, res) => {
            const data = req.body;

            const login = new VerifyLogin(data);
            const credData = await login.verify();
            
            // If no account found return
            if(!credData){
                console.log('Account not found');
                res.sendStatus(404);    // Not found
                return;
            }

            // Get account
            const accountData = await Database.manager.getAccount(credData.uuid);

            // Create refresh & access and send them to frontend
            const tokenData = {
                id: accountData.uuid,
                actType: accountData.actType 
            }

            const access = await JWT.createToken(process.env.ACCESS_SECRET, tokenData, '1h');
            const refresh = await JWT.createToken(process.env.REFRESH_SECRET, tokenData, '1d');

            // Store refresh in userCred
            credData.refresh = refresh;
            await credData.save();

            // Add refresh to cookies
            res.set('Content-Type', 'application/JSON');
            res.cookie('jwt', refresh, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.send(JSON.stringify(access));

            return;
        });

        // Validate access token
        this.app.post('/auth/validateToken', async (req, res) => {
            const token = req.body.token

            if(!token){
                res.sendStatus(401); // Unauthorised
                return;
            }

            const data = await JWT.verifyToken(process.env.ACCESS_SECRET, token)
            .catch( e =>{
                res.sendStatus(401); // Unauthorised
                return;
            }); 

            // Send data to frontend
            res.send(JSON.stringify(data)); // Authorised
        });

        // Create access token
        this.app.post('/auth/createToken', async (req, res) => {
            const refresh = req.cookies.jwt;

            if(!refresh){
                res.sendStatus(401);   // Unauthorised
                return
            }
            // Decode refresh to get user ID
            const data = await JWT.verifyToken(process.env.REFRESH_SECRET, refresh)
            .catch( e =>{
                res.sendStatus(401);    // Unauthorised
                return;
            });

            // Get user cred
            const cred = await Database.manager.getCred(data.data.id);

            // Compare stored refresh too cookie refresh
            const verified = refresh === cred.refresh
            
            if(!verified){
                res.sendStatus(401);     // Still unauthorised lol
                return;
            }

            // Generate new access token
            const access = await JWT.createToken(process.env.ACCESS_SECRET, data.data, '1h');
            
            // Send new access to frontend
            res.set('Content-Type', 'application/JSON');
            res.send(JSON.stringify(access));   // Authorised
        });

        // Remove refresh token from cred
        this.app.post('/auth/removeRefresh', async (req, res) => {
            const { userID } = req.body;
            
            // Find cred
            const cred = await Database.manager.getCred(userID);

            // Remove refresh from cred
            cred.refresh = " ";
            cred.save();
            res.sendStatus(200);
        });
    }

    // Middleware for verifying auth
    // Passes userID to function
    async verifyAuth(req, res, next){
        const token = JSON.parse(req.header('Authorisation'));

        if(!token){
            res.sendStatus(401); // Unauthorised
            return;
        }

        const data = await JWT.verifyToken(process.env.ACCESS_SECRET, token)
        .catch(e => {
            res.sendStatus(401); // Unauthorised
            return;
        });

        req.userID = data.data.id;
        next(); // Authorised
        return;
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