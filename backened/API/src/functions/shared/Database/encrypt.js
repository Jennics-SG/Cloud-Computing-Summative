/** Name:   WaglyJs.backend.encrypt.js
 *  Desc:   Script that contains all encryption functions
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const bcrypt = require('bcrypt');

// Class holding encryption functions
class Encrypt{
    // Encrypt password
    // Returns hash if successful & error if not
    static async encryptPass(pass){
        return new Promise((res, rej) => {
            const salt = 8;
            bcrypt.hash(pass, salt, (err, hash) => {
                if(err) rej(err);
                res(hash);
            })
        })
    }

    // Compare plaintext & hash
    // Returns true/false or error if compare cant happen
    static async validPass(plain, hash){
        return new Promise((res, rej) => {
            bcrypt.compare(plain, hash, function(err, result) {
                if(err) rej(err);
                res(result)
            });  
        })
    }
}

module.exports = Encrypt