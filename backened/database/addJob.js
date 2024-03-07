/** Name:   WaglyJs.backend.database.addJob.js
 *  Desc:   Add job to the database
 *  Author: Jimy Houlbrook
 *  Date:   18/02/24
 */

const Database = require('./database');

const {v4: uuid} = require('uuid');

class Job{
    /** Make sure data exists */
    constructor(data){
        // Make sure all data exists
        for(const i in data){
            if(data[i] == '')
                return;
            data[i] = data[i].toString();
        }

        this.data = {
            ...data,
            accepted: false, 
            completed: false,
            uuid: uuid()
        };
    }

    /** Save data */
    async save(){
        // Make sure there isnt already a job offer from this user to walker
        if(await this.jobExists(this.data.user, this.data.walker)) return undefined;

        const job = Database.manager.getJobModel(this.data);
        job.save();
        return job.uuid;
    }

    // check if job exists
    async jobExists(userID, walkerID){
        return await Database.manager.getJob(userID, walkerID)
    }
}

module.exports = Job