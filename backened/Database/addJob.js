const Database = require('./database');

const {v4: uuid} = require('uuid');

class Job{
    constructor(data){
        // Make sure all data exists
        for(const i in data){
            if(data[i] == '')
                return;
            data[i] = data[i].toString();
        }

        this.data = data;
        this.data.uuid = uuid();
    }

    async save(){
        // Make sure there isnt already a job offer from this user to walker
        
    }
}