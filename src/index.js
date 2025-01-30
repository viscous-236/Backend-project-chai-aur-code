// require('dotenv').config({path: './env'});
import dotenv from "dotenv";
import connectToDatabase from "./db/index.js";
import express from "express";

const app = express();
dotenv.config({path: './env'});



connectToDatabase()
.then(() => {
    const port = process.env.PORT || 8000;
    app.on("error",(error) => {
        console.log("ERROR: APPLICATION NOT ABLE TO TALK TO DATABASE",error);
        process.exit(1);
    })
    app.listen(port,() => {
        console.log(`App is listening on the port : ${port}`);
    })
})
.catch((error) => {
    console.log("ERROR: ERROR IN CONNECTION TO DATABASE!!",error);
})



/*
import express from "express";
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) => {
            console.log("ERROR: APPLICATION NOT ABLE TO TALK TO DATABSE",error);
            throw error
        })

        app.listen(process.env.PORT,() =>{
            console.log(`App is listening on the port : ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("ERROR: ERROR IN CONNECTING TO DATABASE",error);
        throw error
    }
})()
*/