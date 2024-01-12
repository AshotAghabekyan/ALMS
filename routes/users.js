import { Router } from "express";
import path from "path";
import {UserController} from "../controllers/usersController.js"
import {isValidLogin, isValidRegistration, isBanned} from "../middlewares/authMiddleware.js";
export let authRouter = new Router();

/**
 * Middleware that checks if a user
 *  is authenticated (checks if there is a user in the session).
 *  If not, it redirects to "/home".
 */
authRouter.use("/account", function(request, response, next) {
    if (!request.session.user) {
        return response.redirect("/home");
    }
    next();
})


/**
 * Handles a GET request to verify if the authenticated user is an admin.
 *  Responds with a success message if admin, otherwise returns a 403 status.
 */
authRouter.get("/administrator_verification", async function(request, response) {
    if (await UserController.isAdmin(request.session.user)) {
        return response.status(200).json({message : 'the administrator check was successful'});
    }
    return response.status(403).json({message : "the user is not an admin"});
})


/**
 * Handles a GET request to check user authorization.
 *  The functionality is implemented in the checkUserAuth method of the UserController.
 */
authRouter.get("/user_authorization_verification", UserController.checkUserAuth)


/**
 * Handles a GET request to retrieve user information based on the email stored in the session.
 */
authRouter.get("/user_info", async function(request, response) {
    let email = request.session.user.email;
    let user = await UserController.userInfo(email);
    if (user) {
        return response.status(200).json({"user": user});
    }
    return response.status(404).json({message: "user not found"});
})


/**
 * Handles a GET request to serve the login page.
 *  Redirects to "/" if the user is already authenticated.
 */
authRouter.get("/login", function(request, response) {
    if (request.session.user) {
        return response.redirect("/");
    }
    response.sendFile(path.resolve("views/users/login.html"));
})


/**
 * Handles a POST request for user login.
 *  Validates the login, sets the user in the session, and responds accordingly.
 */
authRouter.post("/login", isBanned, isValidLogin, async function(request, response) {
    let password  = request.body.password;
    let email = request.body.email;
    let user = await UserController.userLogin(email, password);
    if (user) {
        request.session.user = user;
        await request.session.save();
        return response.status(200).json(user);  
    }

    return response.status(404).json({message : "user not found"});
})



/**
 * Handles a GET request to serve the registration page.
 *  Redirects to "/home" if the user is already authenticated.
 */
authRouter.get("/registration", function(request, response) {
    if (request.session.user) {
        return response.redirect("/home");
    }
    response.sendFile(path.resolve("views/users/registration.html"));
})


/**
 * Handles a POST request for user registration.
 * Validates the registration, creates a new user, and responds accordingly.
 */
authRouter.post("/registration", isBanned, isValidRegistration, async function(request, response) {
    let user = {
        email : request.body.email,
        password : request.body.password,
        fullname : request.body.fullname
    }
    let result = await UserController.userRegistration(user);
    return response.status(result.statusCode).json({message : result.message});
})


//Handles a GET request to serve the account page.
authRouter.get(`/account`, function(request, response) {
    response.sendFile(path.resolve("views/users/account.html"));
});


//Handles a PUT request to update user information.
authRouter.put("/account", async function(request, response) {
    let updateData = request.body;
    let user = request.session.user;
    let result = await UserController.updateUserInfo(user, updateData);
    return response.status(result.statusCode).json({message : result.message});
})


//Handles a DELETE request to delete a user account.
authRouter.delete("/account", async function(request, response) {
    let password = request.body.password;
    let result = await UserController.deleteUserAccount(request.session.user, request.session, password);
    if (result.ok) {
        return response.status(result.statusCode).json({message : result.message});
    }
    return response.json({message : result.message});
})


//Handles a GET request to logout. Destroys the session and redirects to "/home".
authRouter.get("/logout", async function(request, response) {
    await UserController.destroyRequestSession(request.session);
    response.redirect("/home");
});

