"use strict"
import { headerNavBar } from "./index.js";
headerNavBar();

let registrForm = document.forms.registr;
registrForm.onsubmit = function (event) {
    event.preventDefault();
    let userInfo = new FormData(registrForm);

    fetch("/auth/registration", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            fullname: userInfo.get("fullname"),
            email: userInfo.get("email"),
            password: userInfo.get("password"),
            confirmPassword: userInfo.get("confirm-password"),
        }),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    })
    .then(async (response) => {
        let parsedResponse = await response.json();
        if (response.status == 200) {
            alert(parsedResponse.message);
            window.location.href = '/auth/login';
        } else {
            throw new Error(parsedResponse.message);
        }
    })
    .catch((err) => {
        alert(err.message);
    })
}