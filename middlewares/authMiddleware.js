"use strict"
import {database} from "../app.js"

let emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/;


export function isValidLogin(request, response, next) {
    let {email, password} = request.body;
    if (password.length < 8 || password.length > 20) {
        return response.status(400).json({message : "invalid password"});
    }

    else if (!emailRegEx.test(email)) {
        return response.status(400).json({message : "invalid email"});
        

    } else {
        next();
    }
    
}


export async function isValidRegistration(request, response, next) {
    let {fullname, email, password, confirmPassword} = request.body;

    let usersCollection = await database.collection("users");
    let candidate = await usersCollection.findOne({"email" : email});
    if (candidate) {
        return response.status(403).json({message : "a user with this email already exists"});
    }

    if (fullname.split(" ").length != 2) {
        return response.status(400).json({message : "Invalid fullname"});
    }

    if (!emailRegEx.test(email)) {
        return response.status(400).json({message : "Invalid email"});
    }

    if (password.length < 8 || password.length > 20) {
        return response.status(400).json({message : "Invalid password"});
    }
    
    if (password != confirmPassword) {
        return response.status(400).json({message : "confirm password"});
    }

    next();
}


export async function isBanned(request, response, next) {
    let email = request.body.email;
    let bannedUsersCollection = await database.collection("bannedUsers");
    let candidate = await bannedUsersCollection.findOne({"email" : email});
    if (candidate) {
        console.log("banned user found");
        return response.status(400).json({message: `This account has been blocked by the ALMS administration.\nReason: ${candidate.banReason}`});
    }
    next();
}