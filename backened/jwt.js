/** Name:   WaglyJs.backend.jwt.js
 *  Desc:   Backend code for dealing with JWT tokens   
 *  Author: Jimy Houlbrook
 *  Date:   17/02/24
 */

const jwt = require('jsonwebtoken');

// CLass to hold the code init
class JWT{
    /** Create a token
     * 
     * @param {String}  secret       Secret Key 
     * @param {object}  data         Data to store in token 
     * @param {String}  expiresIn    Length to expiry
     * 
     * @returns signed token
     */
    static async createToken(secret, data, expiresIn){
        return new Promise((res, rej) => {
            jwt.sign({data}, secret, {expiresIn}, (err, token) => {
                if(err) rej(err);
                res(token)
            });
        });
    }
    
    /** Verify a token
     * 
     * @param {String} secret   Secret Key 
     * @param {String} token    Token to verify 
     * @returns Data stored in token
     */
    static async verifyToken(secret, token){
        return new Promise((res, rej) => {
            // verify a token symmetric
            jwt.verify(token, secret, function(err, decoded) {
                if(err) rej(err);

                // Ensure token is not expired
                if(Date.now() >= decoded.exp * 1000) rej('Expired');

                res(decoded);
            });
        })
    }
}

module.exports = JWT