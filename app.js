"use strict"
import path from 'path'
import express from 'express'
import session from 'express-session';
import fs from 'fs'
import ejs from 'ejs';

const app = express();

app.set("views", 'ejs');
app.use(express.static("public"));
app.use(session({
    secret: "reuhfefehfre fh w218r vd qid whdwpoqpd deefe",
    cookie: {maxAge : 60000},
}))
app.use(express.urlencoded({extended: true}))


app.get("/", function(request, response) {
    if (!request.session.views) {
        response.redirect("/login");
        return;
    }
    response.sendFile(path.resolve("views/layout/main.html"))
})


app.get("/login", function(request, response) {
    response.sendFile(path.resolve("views/users/login.html"));
})


app.post("/login", async (request, response) => {  
    if (!request.session.views) {
        request.session.views = 1;
    } else {
        ++request.session.views
    }
    let usersData = await fs.promises.readFile('users.json', 'utf-8'); 
    let parsedData= JSON.parse(usersData); 
    for (let user in parsedData) {
        let isValidInput = false;
        if (parsedData[user].password == request.body.password) {
            if (parsedData[user].email == request.body.email) {
                response.sendFile(path.resolve("views/layout/main.html"));
                response.redirect("/");
                isValidInput = true;
            }
        }
        if (isValidInput) {
            return;
        }
    }
    response.send("User not found");
})


app.get("/registration", function(request, response) {
    response.sendFile(path.resolve("views/users/register.html"));
})


app.post("/registration", async function(request, response) {
    try{
        let rawdata = await fs.promises.readFile('users.json', 'utf-8'); 
        let parseddata= JSON.parse(rawdata); 
        parseddata.push({
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        });
        let data = JSON.stringify(parseddata);
        await fs.promises.writeFile('users.json', data);
        response.redirect("/login");
    }
    catch(err) {
        response.send(`Woops, error in ${err}, try again`);
    }
})

app.get("/catalog", function(request, response) {
    response.sendFile(path.resolve("views/books/catalog.html"))
})

app.get("/book-details", function(request, response) {
    response.sendFile(path.resolve("views/books/bookDetails.html"))
})

app.listen(3000, function() {
    console.log('server run!');
})