// Script to validate access token an redirect to correct page if needed
// if access token not validated create new access with refresh
// when new access token try original request again
// when refresh not validated redirect to login
// Also deals with logging out

import * as Tokens from '../../static/tokens.js'

class StaticRedirect{
    constructor(){
        this.url = window.location.href;
        this.init();
    }

    async init(){
        if(this.url.includes('lsu')) return;

        // Check if access token is valid & get account Type
        this.act = await Tokens.validateToken();

        // Act should only be a number if unauthorised
        // Regen token and then try request again
        if(typeof(this.act) == "number"){
            await this.genToken();
            this.act = await Tokens.validateToken();
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

    async validateToken(){
        const token = JSON.parse(localStorage.getItem('access'));

        const response = await fetch('../../auth/validateToken',{
            'method': 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify({token})
        });

        if(response.status != 200) return response.status;

        const data = await response.json();

        return data.data;
    }

    async genToken(){
        const response = await fetch('../../auth/createToken', {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            }
        });

        if(response.status !== 200){
            window.location.href = '../../lsu/'
            return;
        }

        // Put new access in local
        localStorage.setItem('access', JSON.stringify(await response.json()));
        return;
    }

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

new StaticRedirect