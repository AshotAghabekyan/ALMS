import {Router} from "express";
import {database} from "../app.js";
import path from "path";
export let bookRouter = new Router();


bookRouter.get("/getBooks", async function(request, response) {
    try {
        let booksCollection = await database.collection("books");
        let result = [];
        let cursor = await booksCollection.find();
        await cursor.forEach(book => {
        result.push(book);
        });
        response.status(200).json(result);
    }
    catch(error) {
        console.log(`error in ${error}`);
        response.status(500).json({message : "fetch error"});
    }
})


bookRouter.get("/book-details/:isbn", function(request, response) {
    response.sendFile(path.resolve("views/books/bookDetails.html"));
})


bookRouter.get("/getBookByISBN/:isbn", async function(request, response) {
    try {
        let booksCollection = await database.collection("books");
        let requiredBook = await booksCollection.findOne({"isbn" : request.params.isbn});
        if (requiredBook) {
            return response.status(200).json(requiredBook);
        }
        return response.status(404).json({message : "book not found"});
    }
    catch(error) {
        response.status(500).json({message : `error in fetch (${error})`});
    }
})




