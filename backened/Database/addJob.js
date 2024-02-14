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
        this.data.accepted = false;
        this.data.completed = false;
        this.data.uuid = uuid();
    }

    async save(){
        // Make sure there isnt already a job offer from this user to walker
        if(await this.jobExists(this.data.user, this.data.walker)) return undefined;

        const job = Database.manager.getJobModel(this.data);
        job.save();
        return job.uuid;
    }

    async jobExists(userID, walkerID){
        return await Database.manager.getJob(userID, walkerID)
    }
}

module.exports = Job