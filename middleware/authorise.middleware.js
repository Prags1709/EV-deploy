const authorise = (user_role_arr)=>{
    return(req,res,next)=>{
        const userrole = req.body.userrole;
        if(user_role_arr.includes(userrole)){
            next()
        }else{
            res.send("Not authorised")
        }
    }
}

module.exports = {authorise}