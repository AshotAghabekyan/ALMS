import {Router} from "express";
import path from "path";

import { database } from "../app.js";
import { BookController } from "../controllers/booksController.js";
import { LoanController } from "../controllers/loanControllers.js";
import { checkBorrowDate } from "../middlewares/booksMiddleware.js";
export let bookRouter = new Router();


//Handles a GET request to retrieve all books using
//the getAllBooks method from BookController. Responds with a JSON array of books.
bookRouter.get("/allbooks", async function(request, response) {
    let allBooks = await BookController.getAllBooks();
    response.status(200).json(allBooks);
});


/**Handles a POST request to retrieve
 *  a specified number of random books
 *  using the getRandomBooks method from BookController.
 *  Responds with a JSON object containing the randomly selected books. */
bookRouter.post("/random", async function(request, response) {
    let randomBooksCount = request.body.booksCount;
    let randomBooks = await BookController.getRandomBooks(randomBooksCount);
    response.status(200).json({"books" : randomBooks});
})


/**Handles a GET request to serve an HTML file
 *  for book details. The :isbn parameter
 *  in the route is intended for the ISBN of the book. */
bookRouter.get("/book_details/:isbn", function(request, response) {
    response.sendFile(path.resolve("views/books/bookDetails.html"));
})


bookRouter.get("/user_loans", async function(request, response) {
    let loansCollection = await database.collection("loans");
    let userLoans = await loansCollection.find({owner : request.session.user}).toArray();
    return response.status(200).json({loans : userLoans});
})


/**Handles a GET request to find a book by its ISBN using
 *  the findBookByIsbn method from BookController. Responds with a JSON representation
 *  of the book if found, otherwise returns a 404 status with an appropriate message. */
bookRouter.get("/:isbn", async function(request, response) {
    let isbn = request.params.isbn;
    let targetBook = await BookController.findBookByIsbn(isbn);
    if (targetBook) {
        return response.status(200).json(targetBook);
    }
    return response.status(404).json({message : "book not found"});
})


bookRouter.post("/:isbn/borrow", checkBorrowDate, async function(request, response) {
    if (!request.session.user) {
        return response.status(401).json({message : "user not authorized"});
    }
    let isbn = request.params.isbn;
    let borrowDate = request.body.borrowDate
    let result =  await LoanController.borrowBook(isbn, borrowDate, request.session.user);
    return response.status(result.statusCode).json({message: result.message});
})


bookRouter.delete("/:isbn/borrow", async function(request, response) {
    if (!request.session.user) {
        return response.status(401).json({message : "user not authorized"});
    }
    let isbn = request.params.isbn;
    let booksCollection = await database.collection("books");
    let targetBook = await booksCollection.findOne({"isbn" : isbn});
    let result = await LoanController.deleteBorrow(targetBook); 
    return response.status(result.statusCode).json({message: result.message});
})