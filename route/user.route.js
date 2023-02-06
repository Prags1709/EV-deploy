const express = require("express")
const {UserModel} = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const user_route = express.Router()

user_route.post("/signup",async (req,res)=>{
    const {name,email,pass,role} = req.body
    try {
        bcrypt.hash(pass,4 ,async (err,secure_pass)=>{
            if(err){
                console.log(err);
                res.send("something went wrong")
            }else{
                const user = new UserModel({name, email, pass:secure_pass, role})
                await user.save()
                res.send("Signpu success")
            }
        })
    } catch (error) {
        res.send("error in register the user")
        console.log(error);
    }
})

user_route.post("/login",async (req,res)=>{
    const {email,pass} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(!user){
            res.send("please signup first")
        }else{
            const hash_pass = user?.pass
            bcrypt.compare(pass, hash_pass, (err,result)=>{
                if(result){
                    const normal_token = jwt.sign({userID:user._id, role: user.role},"N_token",{expiresIn:60})
                    const refresh_token = jwt.sign({userID:user._id, role: user.role},"R_token",{expiresIn: 350})
                    res.send({msg:"login success",  normal_token, refresh_token})

                }else{
                    res.send("something went wrong, login again")
                }
            })
        }
       
    } catch (error) {
        res.send("error in login the user")
        console.log(error);
    }
})

user_route.get("/getnewtoken",(req,res)=>{
    const refresh_token = req.headers.authorization?.split(" ")[1]

    if(!refresh_token){
        res.send("login again")
    }else{
        jwt.verify(refresh_token,"R_token", function(err,decode){
            if(decode){
                const normal_token = jwt.sign({userID:decode._id, role: decode.role},"N_token",{expiresIn:60})
                res.send({msg:"login successful",normal_token})
            }else{
                res.send({msg:"Please login first",err})
            }
        })
    }
})

module.exports = {user_route}