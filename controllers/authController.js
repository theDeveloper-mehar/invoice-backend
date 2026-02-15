/* Auth controller 
this controller handles users authentication
it verifies user credentials , generate a teken and sends token to frontend.
*/




const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req,res)=>
{
    try{
       const {email,password} = req.body;

       const user = await User.findOne({email });

       if(!user)
       {
        return res.status(400).json({message:"Invalid Credentials"});
       }

       const isMatch = await bcrypt.compare(password,user.password);

       if(!isMatch)
       {
        return res.status(400).json({message:"Invlid credentials"});
       }

       const token = jwt.sign(
        {
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
       );
       res.json({message:"Seller login successful",token});
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};