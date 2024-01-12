"use strict"
import express from 'express';
import {authRouter} from "./routes/users.js";
import {bookRouter} from "./routes/books.js";
import {homeRouter} from "./routes/home.js";
import {rootRouter} from "./routes/root.js"
import {connectDatabase} from "./config/database.js"
import session from 'express-session';
import MongoStore from 'connect-mongo';
const app = express();


export let database = null;
async function almsDB() {
    database = await connectDatabase();
}
almsDB();


app.use("/public", express.static("public"));
app.use(session({
    secret: 'mySecret',
    saveUninitialized: false,
    cookie: {expires: new Date(253402300000000)},
    store: new MongoStore({
        mongoUrl: process.env.MongoURI,
        collectionName: "user-sessions"
    })
}))
  

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/root", rootRouter);
app.use("/home", homeRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);


app.get("/", function(request, response) {
    response.redirect("/home");
})

app.listen(process.env.PORT, function() {
    console.log('server running...');
})

















































