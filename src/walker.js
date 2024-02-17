import * as Tokens from '../../static/tokens.js'

class Walker{
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

        for(const offer of jobs.offers){
            let details = await this.getJobDetails(offer.user);
            this.makeUIElem(offerCont, {...offer, ...details});
        }
        for(const job of jobs.accepted){
            let details = await this.getJobDetails(job.user);
            this.makeUIElem(jobCont, {...job, ...details});
        }
    }

    // Change to correct tab
    changeTab(tab){
        this.jobsDiv.style.display = tab == 'jobs' ?
            'flex' : 'none';
        this.offersDiv.style.display = tab == 'offers' ?
            'flex' : 'none';
    }

    // Make ui element containing content for parent
    makeUIElem(parent, content){
        console.table(content);

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
        } else {
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

    translateSize(size){
        if(size == "s") size = "Small";
        if(size == "m") size = "Medium";
        if(size == "l") size = "Large";

        return size
    }

    // Gets jobs & offers associated with account & parses
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

    async acceptJob(ownerID){
        await fetch('../../api/acceptJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({ownerID})
        });
    }

    async removeJob(ownerID){
        await fetch('../../api/removeJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorisation': JSON.stringify(Tokens.getAccess())
            },
            body: JSON.stringify({owner: ownerID})
        });
    }
}

document.addEventListener('DOMContentLoaded', new Walker);