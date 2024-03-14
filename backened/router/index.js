/** Name:   WaglyJs.backend.router.js
 *  Desc:   Index for router
 *  Author: Jimy Houlbrook
 *  Date:   14/03/24
 */

// This file exists to access the different routers from one file

const lsuRoutes = require('./loginSignup');
const walkerRoutes = require('./walker')
const ownerRoutes = require('./owner');
const staticRoutes = require('./static')

const routes = {
    LSU: lsuRoutes.router,
    Walker: walkerRoutes.router,
    Owner: ownerRoutes.router,
    Static: staticRoutes.router
}

module.exports = routes;