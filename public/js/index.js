"use strict"



/**
 * Checks if the current user is authorized.
    Sends a request to "/auth/user_authorization_verification" and
    returns true if the response status is 200 (OK), otherwise returns false.
 */
export async function isUserAuthorized() {
    let response = await fetch("/auth/user_authorization_verification");
    if (response.status == 200) {
        return true;
    } else {
        return false;
    }
}


/**
 * Checks if the current user is an administrator.
Sends a request to "/auth/administrator_verification" and returns true
if the response status is 200 (OK), otherwise returns false.
 */
async function isAdmin() {
    let response = await fetch("/auth/administrator_verification");
    if (response.status == 200) {
        return true;
    }
    return false;
}



/*
    Updates the navigation bar based on the user's authorization and admin status.
Calls isUserAuthorized() to check if the user is authorized. If not, exits the function.
Updates the "LogOut" link in the navigation bar.
Creates an "Account" link and adds it to the navigation bar.
If the user is an admin (checked using isAdmin()), creates an "Admin Mode" link and adds
it to the navigation bar.
*/
export async function headerNavBar() {
    let logo = document.getElementById("img-logo");
    logo.addEventListener("click", function() {
        window.location.href = "/home"; 
    })

    let home = document.getElementById("home");
    home.addEventListener("click", function() {
        window.location.href = "/home";
    })

    let catalog = document.getElementById("catalog");
    catalog.addEventListener("click", function() {
        window.location.href = "/home/catalog";
    })


    if (! await isUserAuthorized()) {
        return;
    }
    let loginElement = document.getElementById("login");
    loginElement.style.display = "none";
    

    let account = document.getElementById("account");
    account.style.display = "flex";
    account.addEventListener("click", function() {
        window.location.href = "/auth/account";
    })

    if (await isAdmin()) {
        let adminPage = document.getElementById("admin");
        adminPage.style.display = "flex";
        adminPage.addEventListener("click", function() {
            window.location.href = "/root/admin";
        })
    }
}



/**
 * Generates HTML elements for a list of books.
Maps through the array of books and creates HTML elements for each book.
Each book element contains a title, author, and a click event listener to navigate to the book details page.
Returns an array of book elements.
 */
export function createBooksHTML(books) {
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

        item.addEventListener("click", function() {
            window.location.href = `/books/book_details/${book.isbn}`;
        });

        return item;
    });
    return elements;
}

