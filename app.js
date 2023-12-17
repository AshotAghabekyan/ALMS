"use strict"
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    response.render('layout/main');    
})

app.get('/login', function(request, response) {
    response.render('users/login')
})

app.get("/registration", (request, response) => {
    response.render('users/register');
})

app.get("/catalog", (request, response) => {
    response.render("books/catalog");
})

app.get("/book-details", (request, response) => {
    response.render("books/bookDetails");
})


app.listen(process.env.PORT, ()=> {
    console.log('server run!');
});





