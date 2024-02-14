class ShowWalkers{
    constructor(){
        this.div = document.getElementById('jobs')
        this.init();
    }

    async init(){
        this.walkers = await this.getWalkers();
        for(const walker of this.walkers){
            const elem = this.makeUIElem(walker);
            this.div.append(elem);
        }
    }

    async getWalkers(){
        // Get walkers from backend
        const response = await fetch('../../api/getWalkers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            }
        });

        return await response.json();
    }

    makeUIElem(walker){
        const cont = document.createElement('label');
        cont.id = "cont";

        const name = document.createElement('h1');
        name.innerHTML = walker.name;
        cont.appendChild(name);

        const contact = document.createElement('button');
        contact.innerHTML = "Make Offer";
        cont.appendChild(contact);

        return cont
    }
}

document.addEventListener('DOMContentLoaded', new ShowWalkers)