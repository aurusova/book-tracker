const { Router } = require ('express');
const controller = require('../controllers/book-controller');

const routes = Router();

//TODO only answer to requests if authenticated....
routes.get('/test', controller.getTest);
routes.get('/books', controller.getBooks);


//routes.get("/messages", res.send("test")); //test message..


module.exports = routes;