const asyncHandler=require('../middleware/asynchandler.js')

const authorised=(...roles)=>

 asyncHandler((req,res,next)=>{
  if(!roles.includes(req.user.role)){
     return next(res.status(400).json({
        success:false,
        message:"you have not permission to this route"
     }))
  }
  next()
})

module.exports=authorised