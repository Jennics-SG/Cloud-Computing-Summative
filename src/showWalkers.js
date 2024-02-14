class ShowWalkers{
    constructor(){
        this.div = document.getElementById('jobs')
        this.init();
    }

    async init(){
        this.walkers = await this.getWalkers();
        console.log(this.jobs);
    }

    async getWalkers(){
        // Get walkers from backend
        const response = await fetch('../../getWalkers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            }
        });

        return await response.json();
    }
}

document.addEventListener('DOMContentLoaded', new ShowWalkers)