"use strict"
import {database} from "../app.js";
import { Loan } from "../models/loan.js";
import { BookController } from "./booksController.js";


export class LoanController {

    static async borrowBook(isbn, borrowTime, user) {
        let targetBook = await BookController.findBookByIsbn(isbn);
        if (!targetBook) {
            return {
                message: "book not found",
                ok: false,
                statusCode: 404,
            }
        }
        let loanCollection = await database.collection("loans");
        targetBook.availability = false;
        let loan = new Loan(user, targetBook, borrowTime);
        await loanCollection.insertOne(loan);

        let booksCollection = await database.collection("books");
        await booksCollection.updateOne({"isbn" : isbn}, {$set: {"availability" : false}})
        return {
            message: "successful borrowing",
            ok: true,
            statusCode: 200,
        }
    }


    static async deleteBorrow(book) {
        let loanCollection = await database.collection("loans");
        await loanCollection.deleteOne({"book" : book});
        let booksCollection = await database.collection("books");
        await booksCollection.updateOne({"isbn" : book.isbn}, {$set: {"availability" : true}})
        return {
            message: "The book was successfully returned",
            ok: true,
            statusCode: 200,
        }
    }
}