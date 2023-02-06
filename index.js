const express = require("express")
const {connection} = require("./config/db")
const {user_route} = require("./route/user.route")
const {authenticate} = require("./middleware/auth.middleware")
const {authorise} = require("./middleware/authorise.middleware")
const fs = require("fs")

const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("WELCOME")
})

app.use("/",user_route)

app.use(authenticate)

app.get("/goldrate",(req,res)=>{
    res.send("HERE IS YOUR'S GOLDRATE DATA")
})

app.get("/userstats", authorise(["manager"]),(req,res)=>{
    res.send("HERE IS YOUR'S ***USERSTATS*** DATA")
})

app.get("/logout",(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    const blacklisted_data = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklisted_data.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisted_data))
    res.send("Logout successful")
})

app.listen(1313,async ()=>{
    try {
        await connection
        console.log("DB connected");
    } catch (error) {
        console.log(error);
        console.log("DB dose not connected");
    }
    console.log("Port running at 1313");
})