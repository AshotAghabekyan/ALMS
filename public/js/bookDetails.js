"use strict"


async function getBookInfo(isbn) {
    try {
        let response = await fetch(`/books/getBookByISBN/${isbn}`);
        let bookInfo = await response.json();
        return bookInfo;
    } catch {
        return false;
    }
}


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

}
displayBookDetails();


async function getRecomendedBooks () {
    let hrefs = window.location.href.split("/");
    let isbn = hrefs[hrefs.length - 1];
    let book = await getBookInfo(isbn);
    let response = await fetch("/books/getBooks");
    let allBooks = await response.json();

    let filteredBooks = allBooks.filter(function(value) {
        let coincidenceGenres = 0;
        for (let i = 0; i < book.category.length; ++i) {
            if (value.isbn == isbn) {
                return false;
            }

            let targetBookCategory = book.category[i].split(" ");
            targetBookCategory.map(function(category) {
                if (value.category.join(" ").split(" ").includes(category)) {
                    ++coincidenceGenres;
                }
            })
        }
        if (coincidenceGenres >= 2) {
            return true;
        }
    })
    return filteredBooks;
}


async function showRecomendedContent() {
    let books = await getRecomendedBooks();
    let booksPreview = document.querySelector(".books-preview");

    let elements = books.map(book => {
        let item = document.createElement("div");
        let picture = document.createElement("div");
        let info = document.createElement("div");
        item.className = "item";
        picture.className = "picture";
        info.className = "info";
        let title = document.createElement("h3");
        let author = document.createElement("p");

        title.innerHTML = book.title;
        author.innerHTML = book.authors.join(", ");

        item.append(picture, info);
        info.append(title, author);

        item.addEventListener("click", function () {
            window.location.href = `/books/book-details/${book.isbn}`;
        });
        return item;
    });

    booksPreview.append(...elements); 
}
    
showRecomendedContent();