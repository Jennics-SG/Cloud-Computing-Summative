/** Name:   WaglyJs.frontend.staticRedirect.js
 *  Desc:   Script to validate access token, redirect if needed 
 *          & handle user logging out
 *  Author: Jimy Houlbrook
 *  Date:   17/02/24
 */

import * as Tokens from '../../static/tokens.js'

// Class to hold code
class StaticRedirect{
    // Get URL
    constructor(){
        this.url = window.location.href;
        //this.init();
    }

    /** Initialise & run static redirects
     * 
     *  @description validates access token to get account type and then checks 
     *  if the account is allowed on connected page, if not redirect
     *  to correct page
     * 
     * @returns if user is on login page
     */
    async init(){
        if(this.url.includes('lsu')) return;

        // Check if access token is valid & get account Type
        this.act = await Tokens.validateToken();

        // Act should only be a number if unauthorised
        // Regen token and then try request again
        if(typeof(this.act) == "number"){
            await Tokens.genToken(
                async _=> this.act = await Tokens.validateToken()
            );
        }

        const actType = this.act.actType;

        // Redirect user if they're connected to wrong page
        switch(actType){
            case "owner":
                if(this.url.includes('walker'))
                    window.location.href = "../../../home/owner";
                break;
            case "walker":
                if(this.url.includes('owner'))
                    window.location.href = "../../../home/walker"
                break;
        }

        // Listener for logout button
        const logoutBtn = document.getElementById('logout');
        logoutBtn.addEventListener('click', this.logout.bind(this))
    }

    /** Log user out of page */
    async logout(){
        localStorage.clear();

        const userID = this.act.id;

        await fetch('../../auth/removeRefresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify({userID})
        });

        window.location.href = "../../lsu";
    }
}

//new StaticRedirect