import {database} from "../app.js";
import {Book} from "../models/book.js";


export class BookController {

    /**
     * Retrieve all books from the database.
    Queries the 'books' collection in the database and returns an array containing all books.
     */
    static async getAllBooks() {
        try {
            let booksCollection = await database.collection("books");
            let books = await booksCollection.find().toArray();
            return books
        }
        catch(error) {
            console.log(`error in ${error}`);
            return error
        }
    }


    /**
     * Retrieve a specified number of random books from the database.
    Calls getAllBooks() to get all books, then randomly
    selects books until the specified count is reached. Returns an array of randomly selected books.
     */
    static async getRandomBooks(count) {
        let books = await this.getAllBooks();
        let randomBooks = [];
        while (randomBooks.length != count) {
            let randomElement = books[Math.floor(Math.random() * books.length)]
            if (randomBooks.includes(randomElement)) {
                continue;
            }
            randomBooks.push(randomElement);
        }
        return randomBooks;
    }


    /**
     * Find a book by its ISBN.
    Queries the 'books' collection in the database to find
    a book with the given ISBN. Returns the book if found; otherwise, returns null.
     */
    static async findBookByIsbn(isbn) {
        try {
            let booksCollection = await database.collection("books");
            let requiredBook = await booksCollection.findOne({"isbn" : isbn});
            return requiredBook || null
        }
        catch(error) {
            return error;
        }
    }

    /**
     * Create a new book in the database.
    Creates a new Book instance using the
    provided book details and inserts it into the 'books' collection in the database.
     */
    static async createBook(book) {
        let newBook = new Book(book.title, book.authors, book.isbn, book.category,
            book.published_year, book.page_count, book.language, book.publisher);
        let booksCollection = await database.collection("books");
        await booksCollection.insertOne(newBook);
    }


    /**
     * Delete a book by its ISBN.
    Deletes a book from the 'books' collection in the database based on the provided ISBN.
    Returns a status object indicating the success or failure of the deletion.
     */
    static async deleteBook(isbn) {
        let booksCollection = await database.collection("books");
        let result = await booksCollection.deleteOne({"isbn" : isbn});
        
        if (result.deletedCount < 1) {
            return {
                message: "the book has not been deleted",
                ok: false,
                statusCode: 500,
            }
        }
        return {
            message: "book successful deleted",
            ok: true,
            statusCode: 200,
        }
    }
}