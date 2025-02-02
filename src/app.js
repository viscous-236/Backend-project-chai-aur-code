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

// import routes
import userRouter from "./routes/user.routes.js";


// routes declaration
app.use("/api/v1/users",userRouter);
// https://localhost:3000/api/v1/users/register
// /users act as prefix for all the routes in userRouter or we can say it is base url for all the routes in userRouter
// when this command is executed the control is transferred to userRouter 
// all the methods will now be in userRouter



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