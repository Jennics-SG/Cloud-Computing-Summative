/** Name:   WaglyJs.frontend.showWalkers.js
 *  Desc:   Code to show all walkers too user & handle job offers
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */
import * as Tokens from '../../static/tokens.js'

// Class to hold the code
class ShowWalkers{
    /** get HTML elements */
    constructor(){
        this.div = document.getElementById('jobs')
        this.init();
    }

    /** Get walkers and create UI elem for each */
    async init(){
        const walkers = await this.getWalkers();
        for(const walker of walkers){
            const elem = this.makeUIElem(walker);
            this.div.append(elem.cont);
        }
    }

    /** Make a UI element for the walker
     * 
     * @param {Array} walker 
     * @returns Walker ID & HTML Label element
     */
    makeUIElem(walker){
        const cont = document.createElement('label');
        cont.id = "cont";

        const name = document.createElement('h1');
        name.innerHTML = walker.name;
        cont.appendChild(name);

        const contact = document.createElement('button');
        contact.innerHTML = "Make Offer";
        contact.addEventListener('click', _=> this.offerJob(walker.uuid));
        cont.appendChild(contact);

        return {id: walker.uuid, cont: cont}
    }

    /** Get walkers from backend with API call
     * 
     * @returns Array of walkers
     */
    async getWalkers(){
        const response = await fetch('../../api/getWalkers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            }
        });

        return await response.json();
    }

    /** Offer job to walker
     * 
     * @param {String} walkerID 
     * @returns callback 
     */
    async offerJob(walkerID){
        const response = await fetch('../../api/offerJob', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON",
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({walker: walkerID})
        });

        // regen access and try again if unauthorised
        if(response.status != 200) return Tokens.genToken(_=> this.offerJob(walkerID));
    }
}

document.addEventListener('DOMContentLoaded', new ShowWalkers)