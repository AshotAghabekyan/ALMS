"use strict"
import { headerNavBar } from "./index.js";
headerNavBar()


/**
 * Fetches user information from the server.
Sends a GET request to the "/auth/user_info" endpoint, parses
the JSON response, and returns the user information.
 */
async function userInfo() {
    let response = await fetch("/auth/user_info");
    let parsedResponse = await response.json();
    return parsedResponse.user;
}


/**
 * Displays user information on the HTML page.
Calls userInfo to get user details
and updates HTML elements with the retrieved user information.
 */
async function displayUserInfo() {
    let user = await userInfo();
    if (!user) {
        return;
    }
    let firstnameElement = document.getElementById("firstname").querySelector("p");
    let lastnameElement = document.getElementById("lastname").querySelector("p");
    let emailElement = document.getElementById("email").querySelector("p");

    let [firstname, lastname] = user.fullname.split(' ');
    firstnameElement.innerHTML = firstname;
    lastnameElement.innerHTML = lastname;
    emailElement.innerHTML = user.email;
} 
displayUserInfo();



/**
Opens a side menu by adjusting its width.
Takes a menuId as a parameter and sets the width of the corresponding menu to "300px".
*/
function openMenu(menuId) {
    let targetMenu = document.getElementById(menuId);
    targetMenu.style.width = "300px";
}

/**
 * Closes a side menu by adjusting its width to zero.
Takes a menuId as a parameter and sets the width of the corresponding menu to "0".
 */
function closeMenu(menuId) {
    let targetMenu = document.getElementById(menuId);
    targetMenu.style.width = "0";
}


/**
 * Sends a PUT request to update the user's fullname.
Retrieves the new fullname from the 
HTML input, validates it, sends a PUT request
to "/auth/account" with the new fullname, and reloads the page.

 */

let changeFullname = document.getElementById("changeFullname");
let fullnameChangeCancel = document.getElementById("cancelFullnameChange");

changeFullname.addEventListener("click", function() {
    openMenu("fullnameChangePanel");
})
fullnameChangeCancel.addEventListener("click", function() {
    closeMenu("fullnameChangePanel");
})

async function changeUserFullname() {
    let newFirstname = document.getElementById("newFirstname").value;
    let newLastname = document.getElementById("newLastname").value;
    if (newFirstname.split(" ").length >= 2 || newLastname.split(" ").length >= 2) {
        alert("Invalid new input");
        return;
    }

    let response = await fetch(`/auth/account`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"fullname": `${newFirstname} ${newLastname}`}),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    });
    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();
}


let fullnameChangeConfirm = document.getElementById("confirmFullnameChange");
fullnameChangeConfirm.addEventListener("click", changeUserFullname)



/**
 *  Sends a PUT request to update the user's password.
Retrieves the new password from the HTML
input, validates it, sends a PUT
request to "/auth/account" with the new password, and reloads the page.
 */
let changePassword = document.getElementById("changePassword");
let passwordChangeCancel = document.getElementById("cancelPasswordChange");

changePassword.addEventListener("click", function() {
    openMenu('passwordChangePanel');
})

passwordChangeCancel.addEventListener("click", function() {
    closeMenu("passwordChangePanel");
})


async function changeUserPassword() {
    let newPassword = document.getElementById('newPassword').value;
    if (newPassword.length < 8 || newPassword.length > 20) {
        return alert("Invalid new password");
    }


    let response = await fetch("/auth/account", {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({"password": newPassword}),
    });

    let parsedResponse = await response.json();
    alert(parsedResponse.message);
    window.location.reload();   
}


let passwordChangeConfirm = document.getElementById("confirmPasswordChange");
passwordChangeConfirm.addEventListener("click", changeUserPassword)



/**
 * Books Borrowing
 */
let borrowedBooksMenu = document.getElementById("borrowedBooks");
let closeBorrowedBooksPanel = document.getElementById("closeBorrowedBooksPanel");
borrowedBooksMenu.addEventListener("click", function() {
    openMenu("borrowedBooksPanel");
})

closeBorrowedBooksPanel.addEventListener("click", function() {
    closeMenu("borrowedBooksPanel");
})


//get all borrowed books of target user;
async function getUserLoans() {
    let response = await fetch("/books/user_loans");
    let parsedResponse = await response.json();
    return parsedResponse.loans;
}


//delete borrowed book from loans
async function returnBorrowedBook(book) {
    let response = await fetch(`/books/${book.isbn}/borrow`, {
        method: "DELETE",
    })
    let parsedResponse = await response.json();
    return parsedResponse.message;
}



//display borrowed books in modal menu
function borrowedBooks(books) {
    let elements = books.map((book) => {
        let item = document.createElement("div");
        let picture = document.createElement("div");
        let info = document.createElement("div");
        item.className = "item";
        picture.className = "picture";
        info.className = "info";
        let title = document.createElement("h3");
        title.innerHTML = book.title;

        let returnBookBtn = document.createElement("button");
        returnBookBtn.innerHTML = "Return Book";
        returnBookBtn.addEventListener("click", function() {
            returnBorrowedBook(book);
            window.location.reload();

        })
        item.append(picture, info);
        info.append(title, returnBookBtn);
        return item;
    });
    let borrowedBooksPreview = document.getElementById("borrowedBooksPreview");
    borrowedBooksPreview.append(...elements);
}

let userLoans = await getUserLoans();
let books = [];
userLoans.forEach((loan) => {
    books.push(loan.book);
})

borrowedBooks(books);



/**
 * Sends a DELETE request to delete the user's account.
Retrieves the password for account
 deletion, sends a DELETE request to "/auth/account" with the password, and reloads the page.
 */

 let deleteAccount = document.getElementById("deleteAccount");
 let accountDeletionCancel = document.getElementById("cancelDeletion");
 deleteAccount.addEventListener("click", function() {
     openMenu("deleteAccountPanel")
 })
 
 accountDeletionCancel.addEventListener("click", function() {
     closeMenu("deleteAccountPanel");
 })

async function deleteUserAccount() {
    let password = document.getElementById("passwordForDeletion").value;
    
        let response = await fetch("/auth/account", {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"password" : password}),
        });    

        let parsedResponse = await response.json();
        alert(parsedResponse.message);
        window.location.reload();
}

let accountDeletionConfirm = document.getElementById("confirmDeletion");
accountDeletionConfirm.addEventListener("click", deleteUserAccount);




//user logout
let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", async function() {
    await fetch("/auth/logout");
    window.location.reload();
})