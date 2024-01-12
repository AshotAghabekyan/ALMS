"use strict"
import { headerNavBar } from "./index.js";
import { createBooksHTML } from "./index.js";

headerNavBar()

/**
 * These functions control the width of the navigation panel (openNav, closeNav).
openNav sets the width to "250px",making the panel visible,
while closeNav sets the width to "0," hiding the panel.
 */
function openNav() {
    document.getElementById("aside-panel").style.width = "250px";
  }
  
function closeNav() {
    document.getElementById("aside-panel").style.width = "0";
}


/**
 * Fetches all books from the server.
Uses the Fetch API to make a GET request to "/books/allbooks" and returns the parsed JSON response.
 */
async function getBooks() {
    let response = await fetch("/books/allbooks");
    return await response.json();
}


/**
 * Creates a closure function for dynamically loading book content.
Initializes variables and returns a
function that appends a slice of books to 
the HTML, updating the loaded content count.
 Hides the "View All" button when all books are loaded.
 */
function createProducts(books) {
    let bookPreview = document.querySelector(".books-preview");
    bookPreview.innerHTML = "";
    let loadedContent = 0;

    return function (productCount = books.length) {
        let booksSlice = books.slice(loadedContent, productCount + loadedContent);
        let booksContent = createBooksHTML(booksSlice);

        bookPreview.append(...booksContent);
        loadedContent += productCount;
        if (loadedContent == books.length) {
            let viewAllButton = document.getElementById("view-more");
            viewAllButton.style.display = "none";
        }
    };
}


let books = await getBooks();
let filteredArr = books;

let loadProduct = createProducts(books);
loadProduct(6);

function addBooksContent() {
    loadProduct(3);
}



/**
 * Filter books based on selected genres.
When a filter point is clicked, it
prevents the default behavior, extracts
the genre from the href attribute, filters books accordingly, and
calls the createProducts function to display the filtered books.

 */
let filters = document.querySelectorAll(".filterPoint");
filters.forEach((elem) => {
    elem.addEventListener("click", function(event) {
        event.preventDefault();
        let href = elem.getAttribute("href").split("/")
        let index = href.length - 1;
        let genre = href[index];
        if (genre === "allBooks" ) {
            filteredArr = books;
        } 
        else {
            filteredArr = books.filter((book) => {
                if(book.category.includes(genre)) {
                    return true;
                }
            });
        }
    createProducts(filteredArr)();
    })
})


let viewAllButton = document.getElementById("view-more");
viewAllButton.addEventListener("click", addBooksContent);

let openNavButton = document.querySelector(".openbtn");
openNavButton.addEventListener("click", openNav);

let closeNavButton = document.querySelector(".closebtn");
closeNavButton.addEventListener("click", closeNav);

let resetFilter = document.getElementById('reset-filter');
resetFilter.addEventListener("click", function() {
    createProducts(books)();
})



/**
 * Filters books based on search input.
When the user types in the search input, the function waits for 2 seconds (setTimeout) and then
filters books whose titles start with or include the entered text.
 */
let input = document.getElementById("searchBook");
input.oninput = function() {
    setTimeout(() => {
        let title = input.value;
        let requiredBooks = books.filter((book) => {
            if (book.title.toLowerCase().startsWith(title.toLowerCase())) {
                return true;
            }

            if(book.title.split(" ").includes(title)) {
                return true
            }
        })
        createProducts(requiredBooks)();
    }, 2000);
}
