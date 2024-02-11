const bcrypt = require('bcrypt');

class Encrypt{
    static async encryptPass(pass){
        return new Promise((res, rej) => {
            const salt = 8;
            bcrypt.hash(pass, salt, (err, hash) => {
                if(err) rej(err);
                res(hash);
            })
        })
    }

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