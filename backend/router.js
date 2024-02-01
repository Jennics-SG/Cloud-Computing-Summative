class Router{
    // Router for the express application
    constructor(app){
        this.app = app;
        this.routes = {
            get: this.routeGet,
            post: this.routePost
        }
    }

    routeGet(){
        this.app.get('/', (req, res) => {
            res.render('home', {Text: "Hello World"});
        })
    }
    routePost(){}
}

module.exports = Router;