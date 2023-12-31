"use strict"

async function isUserAuthorized() {
    let response = await fetch("/auth/isAuthorized");
    if (response.status == 200) {
        return true;
    } else {
        return false;
    }
}


async function updateNavBar() {
    if (await isUserAuthorized()) {
        var loginElement = document.getElementById("login-logout");
        loginElement.textContent = 'LogOut';
        loginElement.setAttribute('href', "/auth/logout");

        let account = document.createElement("div");
        account.className = "nav-option";
        let href = document.createElement("a");
        href.setAttribute("href", "/auth/account");
        href.innerHTML = "Account"
        let navOptions = document.querySelector(".nav");
        navOptions.append(account);
        account.append(href);
    }
}
updateNavBar();