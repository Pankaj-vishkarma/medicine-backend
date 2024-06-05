const JWT=require('jsonwebtoken')

const isLogin=(req,res,next)=>{
   const token=(req.cookies && req.cookies.token ) || null
   try{
    if(!token){
        return res.status(400).json({
            success:false,
            message:"not authorised"
        })
       }
    
       const payload=JWT.verify(token,process.env.SECRET)
       req.user={id:payload.id,email:payload.email,role:payload.role}
   }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
   }
   next()
}

module.exports=isLogin