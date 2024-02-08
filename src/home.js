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
    }

    showLogin(){
        this.login.style.display = 'flex';
        this.signup.style.display = 'none';
    }

    showSignup(){
        this.login.style.display = 'none';
        this.signup.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', new onReady)