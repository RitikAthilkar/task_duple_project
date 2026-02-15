import express from 'express'
import cookieParser from "cookie-parser";
import cors from 'cors'
import dotenv from 'dotenv'
import route from './routes/route.js'
import connectDB from './config/db.js'
dotenv.config()
const server = express()
server.use(express.json());
server.use(cors({
    origin: "*",
    credentials: true
}));
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use("/", route);

const port = process.env.PORT || 4000
server.listen(port, ()=>{
    connectDB()
    console.log("server connected")
})