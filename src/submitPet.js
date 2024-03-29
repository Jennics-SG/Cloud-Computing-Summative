/** Name:   WaglyJs.frontend.submitPet.js
 *  Desc:   All code for submitting pet to backend
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */
import * as Tokens from '../../static/tokens.js'

// Class holding code for submitting pet
class SubmitPet{
    /** Initialise document elements & listners */
    constructor(){
        // Divs for tabs
        this.YourDogs = document.getElementById('YourDogs');
        this.AddPetDiv = document.getElementById('AddPet');

        // Listeners for changing tabs
        const showAddPet = document.getElementById('showAddPet');
        const cancel = document.getElementById('cancel');

        showAddPet.addEventListener('click', _=> this.changeTab('addPet'));
        cancel.addEventListener('click', _=> this.changeTab('yourDogs'));
        
        // Add pet button listener
        const addDogBtn = document.getElementById('addDogBtn');
        addDogBtn.addEventListener('click', this.addPet.bind(this));
    }

    /** @description Change Tab shown to user
     * 
     * @param {String} tab  name of tab to be shown 
     */
    changeTab(tab){
        this.YourDogs.style.display = tab == 'yourDogs' ?
            'flex' : 'none';
        this.AddPetDiv.style.display = tab == 'addPet' ?
            'flex' : 'none';
    }

    /** Add new pet to the databse via API call
     * 
     * @returns used to exit function when unauthorised
     *          and regen refresh when needed
     */
    async addPet(){
        // Get pet name & Size
        const data = {
            name: document.getElementById('dogNameIpt').value,
            size: document.getElementById('sizeIpt').value
        }

        // Check all data has value
        for(const i in data){
            if(data[i] == ''){
                this.showUser(`Please enter ${i}`);
                return;
            }
        }

        // Send to backend with fetch request
        const response = await fetch('../../api/addPet', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON",
                'Authorisation': JSON.stringify(Tokens.getAccess())
                
            },
            body: JSON.stringify(data)
        });

        if(response.status == 503){ 
            this.showUser('Error Saving Pet');
            return;
        } else if(response.status != 200) return Tokens.genToken(_=> this.addPet());    // Regen refresh
        
        this.showUser('Pet saved successfully', false);
    }

    /** Show user a message */
    showUser(message, err = true){
        const textElem = document.getElementById('showUser');

        if(err) textElem.style.color = "red";
        else textElem.style.color = "green";

        textElem.innerHTML = "";
        textElem.textContent = message;
    }
    
}

document.addEventListener('DOMContentLoaded', new SubmitPet)