import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '20kb'})) // limit the body size of json file to 20kb
app.use(urlencoded({ extended: true , limit: '20kb'})) // limit the body size of urlencoded file to 20kb;
app.use(express.static('public'))
app.use(cookieParser()) 

export { app };

/*
in the syntax app.get('/', (req, res) => {
    res.send('Hello World')
})
middle ware is used to modify the request and response object
middle ware is like a box beween the request and response object
for expample we can check if the user is logged in or not, using middle ware
and will send the response accordingly
*/