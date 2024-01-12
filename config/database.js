import {MongoClient} from "mongodb"


let mongoURI = process.env.MongoURI;
export async function connectDatabase () {
    let client = await MongoClient.connect(mongoURI);
    console.log("successful connection to database");
    return client.db();
}
