/** Name:   WaglyJs.frontend.showWalkers.js
 *  Desc:   Code to show all walkers too user & handle job offers
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */
class ShowWalkers{
    constructor(){
        // Get owner ID from localstorage
        this.user = JSON.parse(localStorage.getItem('userauth'));

        this.div = document.getElementById('jobs')
        this.init();
    }

    // Get walkers and create UI elem for each
    async init(){
        const walkers = await this.getWalkers();
        for(const walker of walkers){
            const elem = this.makeUIElem(walker);
            this.div.append(elem.cont);
        }
    }

    // Make UI element to hold walker
    makeUIElem(walker){
        const cont = document.createElement('label');
        cont.id = "cont";

        const name = document.createElement('h1');
        name.innerHTML = walker.name;
        cont.appendChild(name);

        const contact = document.createElement('button');
        contact.innerHTML = "Make Offer";
        contact.addEventListener('click', _=> this.offerJob(this.user.userid, walker.uuid));
        cont.appendChild(contact);

        return {id: walker.uuid, cont: cont}
    }

    // Get walkers from database
    async getWalkers(){
        const response = await fetch('../../api/getWalkers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            }
        });

        return await response.json();
    }

    // Offer job to walker
    async offerJob(userID, walkerID){
        const response = await fetch('../../api/offerJob', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify({user: userID, walker: walkerID})
        });
    }
}

document.addEventListener('DOMContentLoaded', new ShowWalkers)