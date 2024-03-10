const { app } = require('@azure/functions');

const Database = require('./shared/Database/database');

app.http('auth_newUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/NewUser',
    handler: async (request, context) => {
        context.log('Creating New User');

        if(!request.body) return {status: 400}  // Bad request

        context.log(request.body);

        // let data;
        // //request.body.setEncoding('utf8');
        // request.body.on('data', (chunk) => {
        //     data += chunk;
        // });
        // request.body.on('end', _=> {
        //     context.log('Data: ', data);
        // });
        // request.body.on('error', (e) => context.error('Error: ', e))

        // Connect to database
        //const connected = Database.manager.connect();

        // if(!connected)
        //     return {status: 500}    // Database conn failed
    }
});
