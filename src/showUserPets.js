/** Name:   WaglyJs.frontend.showUserPets.js
 *  Desc:   Show the pets currently registered to user
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */

class showUserPets{
    constructor(){
        // Get user from localstorage
        this.user = JSON.parse(localStorage.getItem('userauth'));
        
        // Get div for UI elements
        this.div = document.getElementById('dogs');
        this.init();
    }

    // Get dogs and create UI elem for each
    async init(){
        this.dogs = await this.getDogs();
        for(const dog of this.dogs){
            const elem = this.makeUIElem(dog);
            this.div.appendChild(elem);
        }
    }

    // Get dogs from database
    async getDogs(){
        // Get object of dogs from backend
        const response = await fetch('../../api/getPets', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(this.user)
        });

        return await response.json();
    }

    // Make UI elem to hold dog
    makeUIElem(dog){
        const cont = document.createElement('label');
        cont.id = "cont";
        
        const name = document.createElement('h1');
        name.innerHTML = dog.name
        cont.appendChild(name);

        const size = document.createElement('p');
        
        switch(dog.size){
            case 's':
                size.innerHTML = "Small";
                break;
            case 'm':
                size.innerHTML = "Medium";
                break;
            case 'l':
                size.innerHTML = "Large";
                break;
        }

        cont.appendChild(size);

        return cont;
    }
}

document.addEventListener('DOMContentLoaded', new showUserPets)