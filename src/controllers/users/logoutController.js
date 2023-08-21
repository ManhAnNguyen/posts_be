const jwt = require('jsonwebtoken')
const userService = require('../../services/user.service')


const logout =async (req,res) =>{
    const refreshToken  = req.cookies.refreshToken
    //client also clear accessToken
    if(!refreshToken)  res.sendStatus(200)
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    const findUser  = await userService.findOne('username',decoded.username)

    if(!findUser) {
         res.clearCookie('refreshToken')
         res.sendStatus(200)
         return
    }
    await userService.update(['refreshToken'],[''],'username',decoded.username)
    res.clearCookie('refreshToken')
    res.sendStatus(200)
}


module.exports =  logout