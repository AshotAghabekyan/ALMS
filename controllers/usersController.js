import bcrypt from "bcrypt";
import {database}  from "../app.js";
import User from "../models/user.js"

export class UserController {


    /**
     *  Authenticates a user based on the provided email and password.
    Queries the users' collection in the database to find a user with the given email.
    If found, it compares the provided password with the hashed password in the database using bcrypt.
    If the passwords match, it returns the user object; otherwise, it returns null
     */
    static async userLogin(email, password) {
        try {
            let usersCollection = await database.collection("users");
            let candidate = await usersCollection.findOne({"email" : email});
            if (candidate) {
                if (await bcrypt.compare(password, candidate.password)) {
                    return candidate;
                }
            }
            return null;
        } 
        catch(error) {
            console.log(error);
        };
    }


    /*
    Registers a new user in the system.
    Hashes the user's password using bcrypt, creates a new User object,
    and inserts it into the users' collection in the database.
    Returns a status object indicating the success or failure of the registration.
    */
    static async userRegistration(user) {
        try {
            let usersCollection = await database.collection("users");
            let hasedPassword = await bcrypt.hash(user.password, 10);
            let newUser = new User(user.fullname, user.email, hasedPassword, 'user');
            let operationResult = await usersCollection.insertOne(newUser);
            console.log(operationResult);
            if (operationResult.insertedId) {
                return {
                    message: "Successful registration",
                    ok: true,
                    statusCode: 200,
                }
            }
            return false;
        }
        catch(err) {
            console.log(err);
        }
    }


    /**
     * Checks if a user is authenticated based on the presence of a user session.
    If the user is authenticated (session.user exists), it returns a JSON response indicating
    the user is authorized. Otherwise, it returns a 401 Unauthorized status.
     */
    static checkUserAuth (request, response) {
        if (!request.session.user) {
            return response.status(401).json({message : "user not authorized"});
        }
        return response.status(200).json({
            message : "user authorized",
            user: request.session.user,
        });
    }


    /**
     * Retrieves user information based on the provided email.
    Queries the users' collection in the database to find a user with the given email.
    Returns the user object if found; otherwise, it returns null.
     */
    static async userInfo(email) {
        let usersCollection = await database.collection("users");
        let targetUser = await usersCollection.findOne({"email" : email});
        return targetUser || null
    }


    /**
     * Updates user information, including password if provided.
    If the updateData includes a password, it hashes the new password using bcrypt.
    Then, it updates the user's information in the database and updates the
    corresponding fields in the user object.
    Returns a status object indicating the success or failure of the update.
     */
    static async updateUserInfo(user, updateData) {

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        let usersCollection = await database.collection("users");
        let result = await usersCollection.updateOne({"email" : user.email}, {$set: updateData});
        for (let value in updateData) {
            user[value] = updateData[value];
        }
       
        if (result.matchedCount < 1) {
            return {
                message: "woops some error, try again",
                ok: false,
                statusCode: 500,
            }
        }
        return {
            message: "user info successful updated",
            ok: true,
            statusCode: 200,
        }
    }


    /**
     * Destroys a user's session.
    Destroys the provided Express session.
    Returns true if the session is successfully destroyed; otherwise, it returns false.
     */
    static async destroyRequestSession(requestSession) {
        try {
            await requestSession.destroy((err) => {
                if (err) {
                    return false;
                }
                return true;
            });
        }
        catch (err) {
            console.log(err);
        }
    }


    /**
     * Deletes a user's account after confirming the password.
    Compares the provided password with the hashed password in the database.
    If they match, it deletes the user's account from the database and destroys the user's session.
    Returns a status object indicating the success or failure of the account deletion.
     */
    static async deleteUserAccount(user, userSession, password) {
        let usersCollection = await database.collection("users");
        let candidate = await usersCollection.findOne({"email": user.email});
    
        if (! await bcrypt.compare(password, candidate.password)) {
            return {
                message: "invalid password",
                ok : false,
                statusCode: 400,
            };
        }
        let result = await usersCollection.deleteOne({"email": user.email});
        
        if (result.deletedCount >= 1) {
            await this.destroyRequestSession(userSession);
            return {
                message : "account successful deleted",
                ok: true,
                statusCode: 200,
            } 
        }
    }


    /** 
     *  Checks if a user has admin privileges.
    Queries the users' collection in the database to find the user with the given email.
    Checks if the user's role is set to "admin" and returns true or false accordingly.
    */
    static async isAdmin(userSession) {
        
        let usersCollection = await database.collection("users");
        let user = await usersCollection.findOne({"email" : userSession?.email});

        if (!user) {
            return false;
        }
        if (user.role == "admin" && userSession.role == "admin") {
            return true;
        }
        return false;
    }


    /**
     * Grants admin privileges to a user.
    Finds the user with the provided email in the 'users' collection
    and updates their role to "admin"
    Returns a status object indicating the success or failure of the role change.
     */
    static async addAdmin(email) {
        let usersCollection = await database.collection("users");
        let candidate = await usersCollection.findOne({"email" : email});
    
        if (candidate) {
            let result = await usersCollection.updateOne({"email" : email}, {$set: {"role" : "admin"}});
            if (result.matchedCount >= 1) {
                return {
                    message : "the user's role has been successfully changed",
                    ok: true,
                    statusCode: 200,
                };
            }     
        }
        return {
            message : "user not found",
            ok: false,
            statusCode: 404
        };
    }


    /**
     * Revokes admin privileges from a user.
    Finds the user with the provided email in the 'users' collection and updates their role to "user".
    Returns a status object indicating the success or failure of the role change.
     */
    static async deleteAdmin(email) {
        let usersCollection = await database.collection("users");
        let targetAdmin = await usersCollection.findOne({"email": email});
        
        if (targetAdmin.role == "admin") {
            let result = await usersCollection.updateOne({"email" : email}, {$set: {"role" : "user"}});
            if (result.matchedCount >= 1) {
                return {
                    message : "the admin has been successful removed",
                    ok: true,
                    statusCode: 200,
                };
            }
        }
        return {
            message : "the admin not found",
            ok: false,
            statusCode: 404,
        };
    }


    /**
     *  Deletes a user's session based on their email.
    Iterates through user sessions in the 'user-sessions' collection, finds
    the corresponding session based on the user's email, and
    deletes it. Returns true if a session is deleted; otherwise, it returns null.
     */
    static async deleteUserSession(userEmail) {
        let sessionsCollection = await database.collection('user-sessions');
        let sessions = await sessionsCollection.find();
        
        sessions.forEach(async (userSession) => {
            let parsedSession = await JSON.parse(userSession.session);
            if (parsedSession.user.email == userEmail) {
                let result = await sessionsCollection.deleteOne(userSession);
                return result.matchedCount == 1;
            }
        });
        return null;
    }


    /**
     *  Bans a user by deleting their account, storing ban details, and deleting their session.
    Finds the user with the provided email in the users' collection, deletes
    their account, adds ban details to the 'bannedUsers' collection, and deletes the user's session.
    Returns a status object indicating the success or failure of the ban.
     */
    static async banUser(email, reason) {
        let usersCollection = await database.collection("users");
        let targetUser = await usersCollection.findOne({"email" : email});
    
        if (targetUser) {
            await usersCollection.deleteOne({"email" : email});
            let bannedUsersCollection = await database.collection("bannedUsers");
            targetUser.banReason = reason;
            await bannedUsersCollection.insertOne(targetUser);
            await this.deleteUserSession(email);
            return {
                message: "user successful banned",
                ok: true,
                statusCode: 200,
            };
        }
        
        return {
            message: "user not found",
            ok: false,
            statusCode: 404,
        };
    }
}