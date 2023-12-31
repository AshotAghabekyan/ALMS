import { Router } from "express";
import bcrypt from "bcrypt";
import path from "path";
import {database}  from "../app.js";
import User from "../models/user.js"
import {isValidLogin, isValidRegistration} from "../middlewares/authMiddleware.js";
export let authRouter = new Router();



authRouter.use("/account", function(request, response, next) {
    if (!request.session.user) {
        return response.redirect("/home");
    }
    next();
})

authRouter.get("/login", function(request, response) {
    if (request.session.user) {
        return response.redirect("/");
    }
    response.sendFile(path.resolve("views/users/login.html"));
})


authRouter.post("/login", isValidLogin, async (request, response) => {  
    try {
        let usersCollection = await database.collection("users");
        let candidate = await usersCollection.findOne({"email" : request.body.email});
        if (candidate) {
            if (await bcrypt.compare(request.body.password, candidate.password)) {
                request.session.user = candidate;
                await request.session.save();
                return response.json(candidate);
            }
        }
        return response.status(404).json({message : "user not found"});
    } 
    catch(error) {
        response.status(500).json({message : error});
    };
})


authRouter.get("/registration", function(request, response) {
    if (request.session.user) {
        return response.redirect("/home");
    }
    response.sendFile(path.resolve("views/users/register.html"));
})


authRouter.post("/registration", isValidRegistration, async function(request, response) {
    try {
        let usersCollection = await database.collection("users");
        let hasedPassword = await bcrypt.hash(request.body.password, 10);
        let user = new User(request.body.fullname, request.body.email, hasedPassword, 'user');
        usersCollection.insertOne(user);
        response.status(200).json({message : "Successful registration"});
    }
    catch(err) {
        console.log(err);
        response.status(500).json({message : "Sorry, error in server. Try again"});
    }
})


authRouter.get("/isAuthorized", async function(request, response) {
    if (!request.session.user) {
        return response.status(401).json({message : "user not authorized"});
    }
    return response.status(200).json({
        message : "user authorized",
        user: request.session.user,
    });
})


authRouter.get(`/account`, function(request, response) {
    response.sendFile(path.resolve("views/users/account.html"));
});


authRouter.put("/account", async function(request, response) {
    let updateData = request.body;
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    let usersCollection = await database.collection("users");
    let result = await usersCollection.updateOne({"email" : request.session.user.email}, {$set: updateData});

    for (let updatedValue in updateData) {
        request.session.user[updatedValue] = updateData[updatedValue];
    }
    if (result.matchedCount < 1) {
        return response.status(400).json({message : "woops some error, try again"});
    }
    response.status(200).json({message: "user info successful updated"});
})



authRouter.delete("/account", async function(request, response) {
    let password = request.body.password;
    let usersCollection = await database.collection("users");
    let candidate = await usersCollection.findOne({"email": request.session.user.email});

    if (! await bcrypt.compare(password, candidate.password)) {
        return response.status(404).json({message: "invalid password"});
    }
    let result = await usersCollection.deleteOne({"email": request.session.user.email});

    if (result.deletedCount < 1) {
        return response.status(400).json({message: "the user has not been deleted"});
    }
    await request.session.destroy();
    response.status(200).json({message : "account successful deleted"})  
})



authRouter.get("/logout", async function(request, response) {
    try {
        await request.session.destroy((err) => {
            if (err) {
                return response.sendStatus(400);
            }
        });
        response.redirect("/auth/login");
    }
    catch (err) {
        console.log(err);
    }
    
})

