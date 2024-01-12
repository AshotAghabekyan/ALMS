import { Router } from "express";
import path from "path"
import { UserController } from "../controllers/usersController.js"
import { BookController } from "../controllers/booksController.js";

export let rootRouter = new Router();


/**Middleware that checks if the user making the request is an admin.
 *  If not, it redirects to "/home".
 *  This assumes that user information is stored in the session. */
rootRouter.use(async function(request, response, next) {
    console.log(request.session.user);
    if (await UserController.isAdmin(request.session.user)) {
        next();
    } else {
        response.redirect("/home");
    }
})

rootRouter.get("/admin", function(request, response) {
    response.sendFile(path.resolve("views/users/admin.html"));
})


/**
 * Handles a POST request to add an admin.
 *  Expects an email in the request body and responds with the result.
 */
rootRouter.post("/admin_management", async function(request, response) {
    let email = request.body.email;
    let result = await UserController.addAdmin(email);
    return response.status(result.statusCode).json({message : result.message});
});


/**Handles a DELETE request to remove an admin.
 *  Expects an email in the request body and responds with the result. */
rootRouter.delete("/admin_managment", async function(request, response) {
    let email = request.body.email;
    let result = await UserController.deleteAdmin(email);
    return response.status(result.statusCode).json({message : result.message});
});


/**
 * Handles a DELETE request to ban a user.
 *  Expects an email and a ban reason in the request body, and responds with the result.
 */
rootRouter.delete("/ban_user", async function(request, response) {
    let email = request.body.email;
    let banReason = request.body.reason;
    let result = await UserController.banUser(email, banReason);
    return response.status(result.statusCode).json({message : result.message});
})


/**
 * Handles a POST request to create a new book.
 *  Expects book information in the request body and responds with a success message.
 */
rootRouter.post("/books_managment", async function(request, response) {
    let book = {...request.body}
    await BookController.createBook(book);
    return response.status(200).json({message : "the book successful created"});
});


/**
 * Handles a DELETE request to remove a book.
 *  Expects the book's ISBN in the request body and responds with the result.
 */
rootRouter.delete("/books_managment", async function(request, response) {
    let isbn = request.body.isbn;
    let result = await BookController.deleteBook(isbn);
    return response.status(result.statusCode).json({message : result.message});
});