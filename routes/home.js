import {Router} from "express"
import { database } from "../app.js";
import path from "path"
export let homeRouter = Router();


homeRouter.get("/", function(request, response) {
    response.sendFile(path.resolve("views/layout/main.html"));
})

homeRouter.get("/catalog", function(request, response) {
    response.sendFile(path.resolve("views/books/catalog.html"));
})


homeRouter.get("/catalog/:genre", async function(request, response) {
    response.sendFile(path.resolve("views/books/catalog.html"));
})

homeRouter.get("/catalog/:genre/books", async function(request, response) {
    let genre = request.params.genre;
    let collection = await database.collection('books');
    let books = await collection.find({"category" : genre}).toArray();
    if (books.length < 1) {
        return response.status(404).json({message : "no books have been found for this filter"});
    }
    response.status(200).json(books);
})