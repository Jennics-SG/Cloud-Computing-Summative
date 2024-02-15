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

        // Get User ID from localStorage
        this.user = JSON.parse(localStorage.getItem('userauth'));

        this.init();
    }

    // Change to correct tab
    changeTab(tab){
        this.jobsDiv.style.display = tab == 'jobs' ?
            'flex' : 'none';
        this.offersDiv.style.display = tab == 'offers' ?
            'flex' : 'none';
    }

    async init(){
        const jobs = await this.getJobsOffers(this.user.userid);
        console.log(jobs);
    }

    // Gets jobs & offers associated with account & parses
    async getJobsOffers(userID){
        const response = await fetch('../../api/getJobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify({userID})
        });

        const allJobs = await response.json();
        const offers = new Array();
        const accepted = new Array()

        for(const job of allJobs){
            if(job.accepted) accepted.push(job);
            else offers.push(job);
        }

        return { offers, accepted }
    }

    showOffers(offers){
        console.log(offers);
    }


}

document.addEventListener('DOMContentLoaded', new Walker);