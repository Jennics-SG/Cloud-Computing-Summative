class onReady{
    constructor(){
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

        loginTab.addEventListener('click', this.showLogin.bind(this));
        signupTab.addEventListener('click', this.showSignup.bind(this));

        // Listener for user signup
        const signupBtn = document.getElementById('signupbutton');
        signupBtn.addEventListener('click', this.validateSignup.bind(this));

        // Listener for user login
        const loginBtn = document.getElementById('loginButton');
        loginBtn.addEventListener('click', this.validateLogin.bind(this));
    }

    showLogin(){
        this.login.style.display = 'flex';
        this.signup.style.display = 'none';
    }

    showSignup(){
        this.login.style.display = 'none';
        this.signup.style.display = 'flex';
    }

    validateSignup(){
        const data = {
            name: document.getElementById('nameIpt').value,
            email: document.getElementById('emailIpt').value,
            pass: document.getElementById('passIpt').value,
            actType: document.getElementById('typeIpt').value,
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
        });
    }

    validateLogin(){
        const data = {
            email: document.getElementById('LIemailIpt').value,
            pass: document.getElementById('LIpassIpt').value
        }

        for(const key in data){
            if(data[key] == ''){
                this.showUser(`Please enter ${key}`);
                return;
            }
        }

        fetch('../userlogin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    showUser(message){
        const textElem = document.getElementById('showUser');

        textElem.innerHTML = "";
        textElem.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', new onReady)