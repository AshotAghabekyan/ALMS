import {MongoClient} from "mongodb"


let URI = process.env.URI;
export async function connectDatabase () {
    let client = await MongoClient.connect(URI);
    console.log("successful connection to database");
    return client.db();
}
