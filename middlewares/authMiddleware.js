"use strict"


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


export function isValidRegistration(request, response, next) {
    let {fullname, email, password, confirmPassword} = request.body;

    if (fullname.split(" ").length != 2) {
        return response.status(400).json({message : "Invalid fullname"});
    }

    else if (!emailRegEx.test(email)) {
        return response.status(400).json({message : "Invalid email"});
    }

    else if (password.length < 8 || password.length > 20) {
        return response.status(400).json({message : "Invalid password"});
    }
    
    else if (password != confirmPassword) {
        return response.status(400).json({message : "confirm password"});
    }

    else {
        next();
    }

}