const { app } = require('@azure/functions');

const Database = require('./shared/Database/database');

app.http('GetWalkers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Getting Walkers from Database')

        // Connect to database
        // This apparently does nothing even if its not connected properly
        // Originally done in a try/catch but the catch wasnt working so now
        // Checking if database connection is false
        const connected = Database.manager.connect();

        if(!connected)
            return {status: 500}    // Database conn failed

        let result;

        // Finally get the result
        try {
            result = await Database.manager.getWalkers();
        }
        catch (e) {
            context.error(e);
            return { status: 500, body: "Database Issue" };     // Info retrieval failed
        };

        // Return results here
        return { status: 200, body: result }    // Success
    }
});
