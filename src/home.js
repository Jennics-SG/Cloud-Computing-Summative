class onReady{
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

    changeTab(tab){
        this.YourDogs.style.display = tab == 'yourDogs' ?
            'flex' : 'none';
        this.AddPetDiv.style.display = tab == 'addPet' ?
            'flex' : 'none';
    }

    async addPet(){
        // Get owner ID from localstorage
        const user = JSON.parse(localStorage.getItem('userauth'));

        // Get pet name & Size
        const data = {
            name: document.getElementById('dogNameIpt').value,
            size: document.getElementById('sizeIpt').value,
            owner: user.userid
        }

        console.log(data);

        // Check all data has value
        for(const i in data){
            if(data[i] == ''){
                this.showUser(`Please enter ${i}`);
                return;
            }
        }

        // Send to backend with fetch request
        const response = await fetch('../api/addPet', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(data)
        });

        if(response.status == 503){ 
            this.showUser('Error Saving Pet');
            return;
        }
        
        this.showUser('Pet saved successfully', false);
    }

    // Show user a message
    showUser(message, err = true){
        const textElem = document.getElementById('showUser');

        if(err) textElem.style.color = "red";
        else textElem.style.color = "green";

        textElem.innerHTML = "";
        textElem.textContent = message;
    }
    
}

document.addEventListener('DOMContentLoaded', new onReady)