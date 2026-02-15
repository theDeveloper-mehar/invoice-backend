/*
  Authentication Middleware

  This middleware verifies JWT token
  before allowing access to protected routes.

  If token is valid, request proceeds.
  Otherwise, it returns an unauthorized response.
*/




const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({message:"Not authorized"});
    }
    try
    {
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.role !== "SELLER")
        {
            return res.status(403).json({message:"Access Denied"});
        }
         
        req.user = decoded;
        next();
    }
    catch(error)
    {
        res.status(401).json({message:"Invalid token"});
    }
};
