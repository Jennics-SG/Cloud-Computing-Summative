const { app } = require('@azure/functions');

const Database = require('./shared/Database/database');

app.http('GetWalkers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Getting Walkers from Database')

        // Connect to database
        try {Database.manager.connect()}
        catch (e) {
            context.error(e);
            return { status: 500, body: "Database connection issue" };
        }

        let result;

        // Finally get the result
        try {
            result = await Database.manager.getWalkers();
        }
        catch (e) {
            context.error(e);
            return { status: 500, body: "Database Issue" };
        };

        // Return results here
        return { status: 200, body: result }
    }
});
