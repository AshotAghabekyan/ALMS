"use strict"
import { createBooksHTML, isUserAuthorized } from "./index.js";
import { headerNavBar } from "./index.js";
headerNavBar()

/**
 * Fetches information about a specific book using its ISBN.
Sends a GET request to the server endpoint /books/${isbn} and parses the JSON response.
If successful, returns the book information; otherwise, returns false.
 */
async function getBookInfo(isbn) {
    let response = await fetch(`/books/${isbn}`);
    let bookInfo = await response.json();
        return bookInfo || null;

}


async function isBookAvailability(isbn) {
    let response = await fetch(`/books/book_details/${isbn}/availability`);
    let parsedResponse = await response.json();
    return parsedResponse.availability;
}


/**
 * Displays details of the currently viewed book on the HTML page.
Extracts the ISBN from the current URL, calls
getBookInfo() to retrieve book details, and updates the HTML
elements with the relevant information. Redirects to the home page if the book is not found.
 */
async function displayBookDetails() {
    let hrefs = window.location.href.split("/");
    let isbn = hrefs[hrefs.length - 1]
    let book = await getBookInfo(isbn);
    if (!book) {
        alert("book not found");
        window.location.href = "/home";
        return;
    }

    let title = document.getElementById("title").querySelector("p");
    let author = document.getElementById("author").querySelector("p");
    let genre = document.getElementById("genre").querySelector("p");
    title.innerHTML = book.title;
    author.innerHTML = book.authors.join(", ");
    genre.innerHTML = book.category.join(", ");

    if (!await isUserAuthorized()) {
        document.getElementById("borrow-book").disabled = true;
        return;
    }

    if (!await isBookAvailability(isbn)) {
        let borrowButton = document.getElementById("borrow-book");
        borrowButton.innerHTML = "book not available";
        borrowButton.disabled = true;
    }
}
await displayBookDetails();



/**
 * Fetches a list of recommended books based on the genre of the currently viewed book.
Calls getBookInfo() to obtain details of the current book,
then fetches all books and filters them based on
shared genre words. Returns the filtered list of recommended books.
 */
async function getRecomendedBooks() {
    let hrefs = window.location.href.split("/");
    let isbn = hrefs[hrefs.length - 1];
    let targetBook = await getBookInfo(isbn);
    let response = await fetch("/books/allbooks");
    let allBooks = await response.json();

    let filteredBooks = allBooks.filter(function(candidateBook) {
        if (candidateBook.isbn === isbn) {
            return false;
        }

        let wordsToMatch = [];
        targetBook.category.forEach(function(genre) {
            wordsToMatch.push(...genre.toLowerCase().split(" "));
        });
        let coincidenceWordsCount = 0;
        let candidateBookCategoryWords = candidateBook.category.join(" ").toLowerCase().split(" ");
        wordsToMatch.forEach(function(word) {
            if (candidateBookCategoryWords.includes(word)) {
                ++coincidenceWordsCount;
            }
        });

        if (coincidenceWordsCount >= 2) {
            return true;
        }
        return false;
    });
    return filteredBooks;
}


/**
 * Displays recommended books on the HTML page.
Calls getRecommendedBooks to fetch recommended books, creates
HTML elements for each book using createBooksHTML,
and appends them to the "books-preview" section on the page.
 */
async function showRecomendedContent() {
    let books = await getRecomendedBooks();
    let booksPreview = document.querySelector(".books-preview");

    let recomendedBooks = createBooksHTML(books);
    booksPreview.append(...recomendedBooks); 
}
    
showRecomendedContent();



function openMenu(menuId) {
    let targetMenu = document.getElementById(menuId);
    targetMenu.style.width = "80%";
}

function closeMenu(menuId) {
    let targetMenu = document.getElementById(menuId);
    targetMenu.style.width = "0";
}

let openBorrowMenu = document.getElementById("borrow-book");
openBorrowMenu.addEventListener("click", function() {
    openBorrowMenu.disabled = true;
    openMenu("bookBorrowModal");
}) 


let closeBorrowMenu = document.getElementById("cancel-borrow");
closeBorrowMenu.addEventListener("click", function() {
    openBorrowMenu.disabled = false;
    closeMenu("bookBorrowModal");
})



async function borrowBook() {
    let hrefs = window.location.href.split("/");
    let isbn = hrefs[hrefs.length - 1];
    let borrowDate = document.getElementById("borrowDate").value;

    let response = await fetch(`/books/${isbn}/borrow`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({"borrowDate" : borrowDate}),
    })

    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();
}


let confirmBorrowBook = document.getElementById("confirm-borrow");
confirmBorrowBook.addEventListener("click", function() {
    borrowBook();
});


async function deleteBorrowedBook() {
    let hrefs = window.location.href.split("/");
    let isbn = hrefs[hrefs.length - 1];

    let response = await fetch(`/books/${isbn}/borrow`, {
        method: "DELETE",
    });
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();
}




