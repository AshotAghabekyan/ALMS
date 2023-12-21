"use strict"


let registrForm = document.forms.registr;
registrForm.onsubmit = async function (event) {
    let emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/;

    let userInfo = new FormData(registrForm);
    if (!typeof userInfo.get("username") == 'string') {
        alert("Invalid username input");
        event.preventDefault();
        return;
    }

    if (userInfo.get("username").split(" ").length != 2) {
        alert("Invalid username input");
        event.preventDefault()
        return;
    }

    if (!emailRegEx.test(userInfo.get("email"))) {
        alert("Invalid User not foundemail input");
        event.preventDefault();
        return;
    }
    console.log(userInfo.get("password"));
    if (userInfo.get('password').length < 8 || userInfo.get('password').length > 20) {
        alert("Invalid password input");
        event.preventDefault();
        return;
    }
    
    if (userInfo.get('password') != userInfo.get('confirm-password')) {
        alert("Invalid password input");
        event.preventDefault();
        return;
    }
}