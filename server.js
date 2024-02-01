const express = require('express');

// Initialise server variables
const init = () => {
    this.app = express()
    this.port = 3000;

    // Tells the server what view engine to
    // use when rendering HTML
    this.app.set('view engine', 'ejs');

    server.bind(this)();
}

// Server runtime function
const server = () => {
    // listens for actiity on root page
    // takes request, response
    this.app.get('/', (req, res) => {
        console.log(`User connected to root`);

        // Status sends a HTML status code
        // Render renders HTML and can also
        // pass an object to access in the ejs code
        res.status(200)
        res.render('home', {Text: "Hello World"});
    });

    this.app.listen(this.port, () => {
        console.log(`Server Listening on port ${this.port}`);
    });
}

init();