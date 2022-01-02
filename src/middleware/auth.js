/**The goal of the authentication middleware is to validate the authentication token and then
fetch the profile for that user. */
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = async (req,res,next) =>
{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        /*verify - The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid
        . If not, it will be called with the error.*/ 
        const decoded = jwt.verify(token , 'thisismynewcourse')
        /*The findOne() function is used to find one document according to the condition. If multiple documents match the condition, then it
         returns the first document satisfying the condition. */
        const user = await User.findOne({ _id: decoded._id  , 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send('Please authenticate')
    }
}
module.exports = auth;
