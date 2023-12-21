"use strict"

let loginForm = document.forms.login;
loginForm.onsubmit = async function(event) {
    let emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/

    let userInfo = new FormData(loginForm); 
    if (userInfo.get('password').length < 8 || userInfo.get('password').length > 20) {
        alert("Invalid input");
        event.preventDefault();
        return;
    }

    if (!emailRegEx.test(userInfo.get('email'))) {
        alert("Invalid email input");
        event.preventDefault();
        return;
    }
    window.location.reload();   
}
