"use strict"

import { headerNavBar } from "./index.js";
headerNavBar()

/**
 * These functions open and close side menus by adjusting their widths.
They set the width style property of the specified menu to "100%" (open) or "0" (close).
 */
function openMenu(menuId) {
    document.getElementById(menuId).style.width = "100%";
}

function closeMenu(menuId) {
    document.getElementById(menuId).style.width = "0";

}


//books managment modal menu controllers
let openAddBookMenu = document.getElementById("add-book");
openAddBookMenu.addEventListener("click", function () {
    openMenu("addBookForm");
});

let closeAddBookBtn = document.getElementById("cancel-add-book");
closeAddBookBtn.addEventListener("click", function () {
    closeMenu("addBookForm");
});

let openDeleteBookMenu = document.getElementById("delete-book");
openDeleteBookMenu.addEventListener("click", function() {
    openMenu("deleteBookForm");
})

let closeDeleteBookMenu = document.getElementById("cancel-delete-book");
closeDeleteBookMenu.addEventListener("click", function() {
    closeMenu("deleteBookForm");
})



/**
 * Sends a POST request to upload book information to the server.
Takes a book object, sends a POST request to "/root/books_management"
with the book details, and returns the fetch promise.
 */
function uploadBook (book) {
    return fetch("/root/books_managment", {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(book),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    })
}


/**
 * Handles the form submission to create a new book.
Prevents the default form submission, retrieves form data, converts it to a book object,
uploads the book using uploadBook(), displays the server response, and reloads the page.
 */
async function createBook(event) {
    event.preventDefault();
    let formInfo = document.forms.newBook;
    let bookDetails = new FormData(formInfo);
    let book = {
        title : bookDetails.get("title"),
        authors: bookDetails.get("authors").split(", "),
        isbn: bookDetails.get("isbn"),
        category: bookDetails.get("category").split(", "),
        published_year: bookDetails.get("publishedYear"),
        page_count: bookDetails.get("pageCount"),
        language: bookDetails.get("language"),
        publisher: bookDetails.get("publisher"),
    }

    let response = await uploadBook(book);
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload()
}

newBook.onsubmit = createBook;
let createBookBtn = document.getElementById("createBook");
createBookBtn.addEventListener("click", function(event) {
    newBook.onsubmit(event);
})



/**
 * Sends a DELETE request to delete a book by its ISBN.
Takes an ISBN, sends a DELETE request to "/root/books_management"
with the ISBN, displays the server response, and reloads the page.
 */
async function bookDeletion(isbn) {
    let response = await fetch("/root/books_managment", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"isbn" : isbn}),
    });
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();
    
        
}

let deleteBookBtn = document.getElementById("confirm-delete-book");
deleteBookBtn.addEventListener("click", async function() {
    let isbn = document.getElementById("isbnInput").value;
    await bookDeletion(isbn);
})



//users managment modal menu controllers
let openAddAdminMenu = document.getElementById("add-admin");
openAddAdminMenu.addEventListener("click", function() {
    openMenu("addAdminForm");
})

let closeAddAdminMenu = document.getElementById("cancel-add-admin");
closeAddAdminMenu.addEventListener("click", function() {
    closeMenu("addAdminForm");
})

let openRemoveAdminMenu = document.getElementById("delete-admin");
openRemoveAdminMenu.addEventListener("click", function() {
    openMenu("removeAdminForm");
})

let closeRemoveAdminMenu = document.getElementById("cancel-delete-admin");
closeRemoveAdminMenu.addEventListener("click", function() {
    closeMenu("removeAdminForm");
})

let openBanUserMenu = document.getElementById("ban-user");
openBanUserMenu.addEventListener("click", function() {
    openMenu("banUserForm");
})

let closeBanUserMenu = document.getElementById("cancel-ban-user");
closeBanUserMenu.addEventListener("click", function() {
    closeMenu("banUserForm");
})


/**
 * Sends POST and DELETE requests to add or remove an admin.
Send a POST request to "/root/admin_management"
with the user email to add admin or a DELETE request
to "/root/admin_management" with the admin email to remove admin.
Displays the server response and reloads the page.
 */
async function addAdmin(userEmail) {
    let response = await fetch("/root/admin_management", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"email" : userEmail}),
    });
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();
}

let confirmAdminAdd = document.getElementById("confirm-add-admin");
confirmAdminAdd.addEventListener("click",  async function() {
    let userEmail = document.getElementById("userEmail").value;
    await addAdmin(userEmail);
})


async function removeAdmin(email) {

    let response = await fetch("/root/admin_managment", {
        method: "DELETE",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({"email": email}),
    })
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();

        
}

let confirmAdminRemove = document.getElementById("confirm-delete-admin");
confirmAdminRemove.addEventListener("click", async function() {
    let adminEmail = document.getElementById("adminEmail").value;
    await removeAdmin(adminEmail);
})



/**
 * Sends a DELETE request to ban a user.
Takes a user email and a ban reason, sends
a DELETE request to "/root/ban_user" with
the email and reason, displays the server response, and reloads the page.
 */
async function banUser(email, reason) {
    let response = await fetch("/root/ban_user", {
        method: "DELETE",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            "email": email,
            "reason": reason,
        }),
    })
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();  
}


let confirmUserBan = document.getElementById("confirm-ban-user");
confirmUserBan.addEventListener("click", async function() {
    let userEmail = document.getElementById("bannedUserEmail").value;
    let reason = document.getElementById("banReasonDescription").value;
    await banUser(userEmail, reason);
})