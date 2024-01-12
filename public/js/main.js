"use strict"
import { headerNavBar } from "./index.js";
import { createBooksHTML } from "./index.js";

headerNavBar()


/**
 * Fetches a specified number of random books from the server.
 * Sends a POST request to "/books/random" with the specified count. 
 * Expects a JSON response containing an array of random books. 
 * Returns the array of random books.
 */
async function randomBooks(count) {
    let response = await fetch("/books/random", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({"booksCount" : count}),
    })
    let parsedResponse = await response.json();
    return parsedResponse.books;
}



/**
 * Displays a list of books on the web page.
Clears the existing content in the ".books-preview" element.
Calls createBooksHTML to generate HTML elements for the provided array of books.
Appends the generated HTML elements to the ".books-preview" div.
 */
function displayRandomBooks(books) {
    let bookPreview = document.querySelector(".books-preview");
    bookPreview.innerHTML = "";
    let booksContent = createBooksHTML(books);
    bookPreview.append(...booksContent);
}

let books = await randomBooks(6);
displayRandomBooks(books);



function redirectToCatalog() {
    window.location.href = "/home/catalog";
}

let viewMoreBooks = document.getElementById("view-more");
viewMoreBooks.addEventListener("click", redirectToCatalog);

