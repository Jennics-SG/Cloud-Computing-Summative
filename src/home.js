/** Name:   WaglyJs.frontend.home.js
 *  Desc:   All code for the non-user home page
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
            this.showLogin();
        } else {
            this.showSignup();
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
    validateSignup(){
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

        fetch('../newuser', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        // Show user error if there is one
        .then((res) => {
            if(res.status != 200)
                this.showUser('Error registering');
        });
    }

    // Validate login & send to server
    validateLogin(){
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

        // Should probs do some error handling here, cba
        fetch('../userlogin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    // Show user a message
    showUser(message){
        const textElem = document.getElementById('showUser');

        textElem.innerHTML = "";
        textElem.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', new onReady)