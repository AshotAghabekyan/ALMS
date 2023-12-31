"use strict"

let loginForm = document.forms.login;
loginForm.onsubmit = function(event) {
    event.preventDefault();
    let userInfo = new FormData(loginForm); 

    fetch("/auth/login", {
        method : 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            email: userInfo.get("email"),
            password: userInfo.get("password"),
        }),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    })
    .then(async (response) => {
        let parsedResponse = await response.json();
        if (response.status == 200) {
            return parsedResponse;
        } else {
            throw new Error(parsedResponse.message);
        }
    })
    .then(user => {
        window.location.href = '/';
        alert(`Welcome ${user.fullname}`);
    })
    .catch((err) => {
        alert(err.message);
        window.location.href = "/auth/login";
    });
}
