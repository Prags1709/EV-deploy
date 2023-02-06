const jwt = require("jsonwebtoken")
const fs = require("fs")

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const blacklisted_data = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    if(blacklisted_data.includes(token)){
        res.send("Token blacklisted, login again")
    }else{
        if(!token){
            res.send("this route was producted, Login first")
        }else{
            jwt.verify(token, "N_token", function(err,decode){
                if(decode){
                    const userrole = decode?.role;
                    req.body.userrole = userrole
                    next()
                }else{
                    res.send({msg:"Please login first",err})
                }
            })
        }
    }
}

module.exports = {authenticate}