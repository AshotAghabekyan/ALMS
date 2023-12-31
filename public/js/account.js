"use strict"

async function userInfo() {
    let response = await fetch("/auth/isAuthorized");
    let userDetails = await response.json();
    return userDetails.user;
}


async function displayUserInfo() {
    let user = await userInfo();
    let firstnameElement = document.getElementById("firstname").querySelector("p");
    let lastnameElement = document.getElementById("lastname").querySelector("p");
    let emailElement = document.getElementById("email").querySelector("p");

    let [firstname, lastname] = user.fullname.split(' ');
    firstnameElement.innerHTML = firstname;
    lastnameElement.innerHTML = lastname;
    emailElement.innerHTML = user.email;
} 

displayUserInfo();


let changeFullname = document.getElementById("changeFullname");
let changePassword = document.getElementById("changePassword");
let deleteAccount = document.getElementById("deleteAccount");
changeFullname.addEventListener("click", function() {
    document.getElementById("fullnameChangePanel").style.width = "60%";
})

changePassword.addEventListener("click", function() {
    document.getElementById("passwordChangePanel").style.width = "60%"
})

deleteAccount.addEventListener("click", function() {
    document.getElementById("deleteAccountPanel").style.width = "60%";
})


let fullnameChangeConfirmBtn = document.getElementById("confirmFullnameChange");
fullnameChangeConfirmBtn.addEventListener("click", async function() {
    let newFullname = document.getElementById("newUsername").value;
    if (newFullname.split(" ").length != 2) {
        alert("Invalid new fullname");
        return;
    }
    try {
        let response = await fetch(`/auth/account`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"fullname": newFullname}),
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin'
        });
        let parsedResponse = await response.json();
        if (response.status == 200) {
            window.location.reload();
            return alert(parsedResponse.message);
        }
        
        alert(parsedResponse.message);
    }
    catch(error) {
        console.log(error);
    }
    
})

let fullnameChangeCancelBtn = document.getElementById("cancelFullnameChange");
fullnameChangeCancelBtn.addEventListener("click", function() {
    document.getElementById("fullnameChangePanel").style.width = "0px";
})



let passwordChangeConfirmBtn = document.getElementById("confirmPasswordChange");
passwordChangeConfirmBtn.addEventListener("click", async function() {
    let newPassword = document.getElementById('newPassword').value;
    if (newPassword.length < 8 || newPassword.length > 20) {
        return alert("Invalid new password");
    }

    try {
        let response = await fetch("/auth/account", {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({"password": newPassword}),
        });
        let parsedResponse = await response.json();
        if (response.status == 200) {
            window.location.reload();
            return alert(parsedResponse.message);
            
        }
        alert(parsedResponse.message);
        throw new Error("user not modified");
    }
    catch(error) {
        console.log(error);
    }
    
})

let passwordChangeCancelBtn = document.getElementById("cancelPasswordChange");
passwordChangeCancelBtn.addEventListener("click", function() {
    document.getElementById("passwordChangePanel").style.width = "0px";
})



let accountDeletionConfirmBtn = document.getElementById("confirmDeletion");
accountDeletionConfirmBtn.addEventListener("click", async function() {
    let password = document.getElementById("passwordForDeletion").value;
    
    try {
        let response = await fetch("/auth/account", {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({password}),
        });

        let parsedResponse = await response.json();
        if (response.status == 200) {
            window.location.reload();
            return alert(parsedResponse.message);
            
        }
        alert("invalid password");
        throw new Error(parsedResponse.message);
    }
    catch(error) {
        console.log(error);
    }
    
})


let accountDeletionCancelBtn = document.getElementById("cancelDeletion");
accountDeletionCancelBtn.addEventListener("click", function() {
    document.getElementById("deleteAccountPanel").style.width = "0px";
})