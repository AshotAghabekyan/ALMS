import {Router} from "express"
import { database } from "../app.js";
import path from "path"
export let homeRouter = Router();


homeRouter.get("/", function(request, response) {
    response.sendFile(path.resolve("views/layout/main.html"));
})

homeRouter.get("/catalog", function(request, response) {
    response.sendFile(path.resolve("views/books/catalog.html"));
})
