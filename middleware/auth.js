import jwt from "jsonwebtoken";

export const verifytoken = async (req,res,next) => {
    try{
        var token = req.header("Authorization");

        if(!token) return res.status(403).send("Access Denied");

        console.log(token)
        if( token.startsWith("Bearer "))
        {
            token = token.slice(7,token.length).trimLeft();
        }

        const verified = jwt.verify( token , process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch(err) {
        console.log("jjjj")
        res.status(500).json({ msg : err.message})
    }
}