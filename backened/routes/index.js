/** Name:   WaglyJs.backend.router.js
 *  Desc:   Index for router
 *  Author: Jimy Houlbrook
 *  Date:   04/03/24
 */

// This file exists so you can access the routes from
// one file rather than importing all of this into
// the main script lol

const lsuRoutes = require('./loginSignup');
const walkerRoutes = require('./walker');
const ownerRoutes = require('./owner');
const staticRoute = require('./static');

module.exports = {
    LSU: lsuRoutes.router,
    Walker: walkerRoutes.router,
    Owner:  ownerRoutes.router,
    Static: staticRoute.router
};