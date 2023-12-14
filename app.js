"use strict"
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    response.render('users/login');    
})

app.get("/registration", (request, response) => {
    response.render('users/register');
})

app.listen(process.env.PORT, ()=> {
    console.log('server run!');
});





