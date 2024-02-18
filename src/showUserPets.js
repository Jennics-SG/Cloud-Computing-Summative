/** Name:   WaglyJs.frontend.showUserPets.js
 *  Desc:   Show the pets currently registered to user
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */

import * as Tokens from '../../static/tokens.js'

class showUserPets{
    // Get the DIV for UI elems
    constructor(){
        this.div = document.getElementById('dogs');
        this.init();
    }

    /** @description Get list of dogs and create UI elem for it */
    async init(){
        this.dogs = await this.getDogs();
        for(const dog of this.dogs){
            const elem = this.makeUIElem(dog);
            this.div.appendChild(elem);
        }
    }

    /** @description Get dogs from database */
    async getDogs(){
        // Get object of dogs from backend
        const response = await fetch('../../api/getPets', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON",
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
        });

        // Generate new access and try again if unauthorised
        if(response.status != 200) Tokens.genToken(_=> this.getDogs());

        return await response.json();
    }

    /** @description Make the UI elem for information
     * 
     * @param {String} dog  Information to be shown
     * @returns HTML Label Element with information
     */
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