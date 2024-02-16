// JWT auth middleware

const JWT = require('./jwt')

require('dotenv');

class Auth{
    static async verify(req, res, next){
        // Check access token for verification
        const access = req.header('Authorisation')
        let verified = false;
        if(access)
            verified = await JWT.verifyToken(process.env.ACCESS_SECRET, access)

        // Add data to header if verified
        if(verified){
            req.userData = verified
            next();
            return;
        }

        // access is not verified, try with refresh
        const refresh = req.cookies.jwt
        if(refresh)
            verified = await JWT.verifyToken(process.env.REFRESH_SECRET, refresh)

        if(verified){
            // Regenerate access token here
            req.userData = verified
            next();
            return;
        }

        res.sendStatus(401);
    }
}

module.exports = Auth