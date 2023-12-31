"use strict"

async function getBooks() {
    let response = await fetch("/books/getBooks");
    return await response.json();
}


async function createProducts(books) {
    let loadedContent = 0;

    return function (productCount) {
        let bookPreview = document.querySelector(".books-preview");
        let booksSlice = books.slice(loadedContent, loadedContent + productCount);

        let elements = booksSlice.map(book => {
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

        bookPreview.append(...elements);

        loadedContent += productCount;

        if (loadedContent >= books.length) {
            let viewAllButton = document.getElementById("view-all");
            viewAllButton.style.display = "none";
        }
    };
}
let books = await getBooks()
let loadProduct = await createProducts(books);
loadProduct(6);


function viewAllButton () {
    window.location.href = "/home/catalog";
}

let seeMoreButton = document.getElementById("view-all");
seeMoreButton.addEventListener("click", viewAllButton);

