/** Name:   WaglyJs.frontend.walker.js
 *  Desc:   Code for the walkers page
 *  Author: Jimy Houlbrook
 *  Date:   18/02/24
 */

import * as Tokens from '../../static/tokens.js'

// Class holding walker code
class Walker{
    /** Get HTMl elems and set listeners */
    constructor(){
        // Divs for tabs
        this.jobsDiv = document.getElementById("jobs");
        this.offersDiv = document.getElementById("offers");

        // Butons & Listeners for changing tabs
        const jobBtn = document.getElementById('jobsBtn');
        const offersBtn = document.getElementById('offersBtn');

        jobBtn.addEventListener('click', _=> this.changeTab('jobs'));
        offersBtn.addEventListener('click', _=> this.changeTab('offers'));

        this.init();
    }

    /** Get jobs and create UI for them */
    async init(){
        const jobs = await this.getJobsOffers();

        console.log(jobs);

        // Div holding offers
        const offerCont = document.createElement('div');
        offerCont.id = "offerCont";
        this.offersDiv.appendChild(offerCont);

        // Div holding accepted jobs
        const jobCont = document.createElement('div');
        jobCont.id = "jobCont";
        this.jobsDiv.appendChild(jobCont);

        // Show job offers
        for(const offer of jobs.offers){
            let details = await this.getJobDetails(offer.user);
            this.makeUIElem(offerCont, {...offer, ...details});
        }

        // Show accepted jobs
        for(const job of jobs.accepted){
            let details = await this.getJobDetails(job.user);
            this.makeUIElem(jobCont, {...job, ...details});
        }
    }

    /** Change Tab shown to user
     * 
     * @param {String} tab  name of tab to be shown 
     */
    changeTab(tab){
        this.jobsDiv.style.display = tab == 'jobs' ?
            'flex' : 'none';
        this.offersDiv.style.display = tab == 'offers' ?
            'flex' : 'none';
    }

    /** Make UI element
     * 
     * @param {HTMLElement} parent  Parent to add container too 
     * @param {object}      content Content to display 
     */
    makeUIElem(parent, content){
        const cont = document.createElement('label');
        cont.id = 'cont';

        const name = document.createElement('h1');
        name.innerHTML = content.name;
        cont.appendChild(name);

        const petAmount = document.createElement('p');
        petAmount.innerHTML = `${content.pets} Dogs to walk`
        cont.appendChild(petAmount);

        content.largest = this.translateSize(content.largest);

        const largestPet = document.createElement('p');
        largestPet.innerHTML = `Biggest pet is ${content.largest}`
        cont.appendChild(largestPet);

        // Accept / Decline buttons for offer
        if(!content.accepted){
            const accDecCont = document.createElement('div');

            const acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = "Accept";
            acceptBtn.addEventListener(
                'click', _=> this.acceptJob(content.user, content.walker)
            );
            accDecCont.appendChild(acceptBtn);

            const declineBtn = document.createElement('button');
            declineBtn.innerHTML = "Decline";
            declineBtn.addEventListener(
                'click', _=> this.removeJob(content.user, content.walker)
            );
            accDecCont.appendChild(declineBtn);

            cont.appendChild(accDecCont);
        } 
        // Complete / Remove buttons for accepted jobs
        else {
            const completeRemoveCont = document.createElement('div');

            const completeBtn = document.createElement('button');
            completeBtn.innerHTML = "Complete";
            completeBtn.addEventListener(
                'click', _=> this.removeJob(content.user, content.walker)
            );
            completeRemoveCont.appendChild(completeBtn);

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = "Remove";
            removeBtn.addEventListener(
                'click', _=> this.removeJob(content.user, content.walker)
            );
            completeRemoveCont.appendChild(removeBtn);

            cont.appendChild(completeRemoveCont);
        }

        parent.appendChild(cont);
    }

    /** Translate pet size from letter code to word
     * 
     * @param {string} size Letter Code
     * @returns Size in word form
     */
    translateSize(size){
        if(size == "s") size = "Small";
        if(size == "m") size = "Medium";
        if(size == "l") size = "Large";

        return size
    }

    /** Gets jobs & offers associated with account & parses */
    async getJobsOffers(){
        const token = Tokens.getAccess();

        const response = await fetch('../../api/getJobs', {
            method: 'POST',
            headers: {
                'Authorisation': JSON.stringify(token)
            }
        });

        // regen access and try again if unauthorised
        if(response.status != 200) return Tokens.genToken(_=> this.getJobsOffers());

        const allJobs = await response.json();
        const offers = new Array();
        const accepted = new Array()

        for(const job of allJobs){
            if(job.accepted) accepted.push(job);
            else offers.push(job);
        }

        return { offers, accepted }
    }

    /** Get job details with API call
     * 
     * @param {String} ownerID  ID of job owner 
     * @returns details
     */
    async getJobDetails(ownerID){
        const response = await fetch('../../api/getJobDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({ownerID})
        });

        return await response.json();
    }

    /** Accept Job with API call
     * 
     * @param {String} ownerID  ID of job owner 
     * @returns callback
     */
    async acceptJob(ownerID){
        await fetch('../../api/acceptJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({ownerID})
        });

        // regen access and try again if unauthorised
        if(response.status != 200) return Tokens.genToken(_=> this.getJobsOffers(ownerID));
    }

    /** Remove job wiht API call
     * 
     * @param {String} ownerID 
     * @returns callback
     */
    async removeJob(ownerID){
        const response = await fetch('../../api/removeJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({owner: ownerID})
        });

        // regen access and try again if unauthorised
        if(response.status != 200) return Tokens.genToken(_=> this.getJobsOffers(ownerID));
    }
}

document.addEventListener('DOMContentLoaded', new Walker);