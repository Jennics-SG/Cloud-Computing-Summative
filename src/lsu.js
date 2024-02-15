/** Name:   WaglyJs.frontend.lsu.js
 *  Desc:   All code for the login/signup page
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

// Class to hold the code
class onReady{
    constructor(){
        // Get divs for each tab
        this.login = document.getElementById('login');
        this.signup = document.getElementById('signup');

        // Show correct tab from URL
        const url = window.location.href;

        if(url.includes('login')){
            this.changeTab('login');
        } else {
            this.changeTab('signup');
        }

        // Listeners to change tab
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');

        loginTab.addEventListener('click', _=> this.changeTab('login'));
        signupTab.addEventListener('click', _=> this.changeTab('signup'));

        // Listener for user signup
        const signupBtn = document.getElementById('signupbutton');
        signupBtn.addEventListener('click', this.validateSignup.bind(this));

        // Listener for user login
        const loginBtn = document.getElementById('loginButton');
        loginBtn.addEventListener('click', this.validateLogin.bind(this));
    }

    // Change to correct tab
    changeTab(tab){
        this.login.style.display = tab == 'login' ?
            'flex' : 'none';
        this.signup.style.display = tab == 'signup' ?
            'flex' : 'none';
    }

    // Validate & send signup to server
    async validateSignup(){
        const data = {
            name: document.getElementById('nameIpt').value,
            email: document.getElementById('emailIpt').value,
            pass: document.getElementById('passIpt').value,
            actType: document.getElementById('typeIpt').value
        }

        // Check all data has value
        for(const i in data){
            if(data[i] == ''){
                this.showUser(`Please enter ${i}`);
                return;
            }
        }

        // Ensure passwords match
        const confPass = document.getElementById('passConfIpt').value;
        if(confPass != data.pass){
            this.showUser('Passwords do not match');
            return;
        }

        const response = await fetch('../api/newuser', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(response.status != 200){
            this.showUser('Error Registering');
            return;
        }

        const userID = await response.json();
        this.putUserinLocal(userID);
        window.location.href = "../../home/owner";
    }

    // Validate login & send to server
    async validateLogin(){
        const data = {
            email: document.getElementById('LIemailIpt').value,
            pass: document.getElementById('LIpassIpt').value
        }

        // Check data has a value
        for(const key in data){
            if(data[key] == ''){
                this.showUser(`Please enter ${key}`);
                return;
            }
        }

        const response = await fetch('../api/userlogin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(response.status != 200){
            this.showUser('Account information incorrect');
            return;
        }

        const userID = await response.json();
        this.putUserinLocal(userID);
        window.location.href = "../../home/owner";
    }

    // Show user a message
    showUser(message){
        const textElem = document.getElementById('showUser');

        textElem.innerHTML = "";
        textElem.textContent = message;
    }

    // Put user auth in local storage
    putUserinLocal(userID){
        // Clear local just to be safe
        localStorage.clear();

        // Create expiry date
        const date = new Date();
        date.setTime(date.getTime() + (1*24*60*60*1000));
        
        const data = {
            userid: userID.ID,
            expires: date.toUTCString()
        };

        localStorage.setItem('userauth', JSON.stringify(data));
    }
}

document.addEventListener('DOMContentLoaded', new onReady)