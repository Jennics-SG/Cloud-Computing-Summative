const jwt = require('jsonwebtoken');

class JWT{
    static async createToken(secret, data, expiresIn){
        return new Promise((res, rej) => {
            jwt.sign({data}, secret, {expiresIn}, (err, token) => {
                if(err) rej(err);
                res(token)
            });
        });
    }
    
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

// // middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');
// function verifyToken(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });
//     try {
//         const decoded = jwt.verify(token, 'your-secret-key');
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };
