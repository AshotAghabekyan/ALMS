"use strict"

function userUniqueIdGenerator () {
    let id = Math.random() * 10000;
    return function () {
        return id++;
    }
}
let userId = userUniqueIdGenerator();

export class User {
    constructor (username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.id = userId();
        this.role = 'user';
    }
}