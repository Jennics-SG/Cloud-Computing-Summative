class Redirect{
    constructor(){
        // Get user from localstorage
        this.user = JSON.parse(localStorage.getItem('userauth'));

        this.url = window.location.href;

        this.init()
    }

    async init(){
        // Using so many ../ bcs idk how deep its gonna be
        // Cant go further than root directory lol

        // Ensure user is logged in
        if(!this.user && !this.url.includes('lsu')){
            window.location.href = "../../../../lsu"
            return;
        }

        // Redirect user based on account type & url
        const accountType = await this.getAccountType();
        switch(accountType){
            case "owner":
                if(this.url.includes('walker'))
                    window.location.href = "../../../../home/owner"
                break;
            case "walker":
                if(this.url.includes('owner'))
                    window.location.href = "../../../../home/walker"
                break;
        }
    }


    async getAccountType(){
        const response = await fetch('../../api/ownerwalker', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(this.user)
        });

        return await response.json();
    }
}

document.addEventListener('DOMContentLoaded', new Redirect)