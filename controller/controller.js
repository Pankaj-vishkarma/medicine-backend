const userSchema=require('../schema/userSchema.js')
const emailvalidator=require('email-validator')
const cloudinary=require('cloudinary')
const bcrypt=require('bcrypt')
const fs=require('fs/promises')
const cookieOption={
    maxAge:24*60*60*1000,
    httpOnly:true
}

const signup=async(req,res)=>{
  const {name,email,password,confirmpassword}=req.body
  if(!name || !email || !password || !confirmpassword){
    return res.status(400).json({
        success:false,
        message:"all fields are required"
    })
  }

  if(password !== confirmpassword){
    return res.status(400).json({
        success:false,
        message:"password and confirm password"
    })
  }

  const valid_email=emailvalidator.validate(email)

  if(!valid_email){
    return res.status(400).json({
        message:"please provide a valid email"
    })
  }

  try{
       const exits_email=await userSchema.findOne({email})
       if(exits_email){
        return res.status(400).json({
            success:false,
            message:"account already exits"
        })
       }

       const user=await userSchema.create({name,email,password})

       if(!user){
        return res.status(400).json({
            success:false,
            message:"user not created"
        })
       }

       await user.save()

       return res.status(200).json({
        success:true,
        data:user
       })
  }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
  }

}

const signin=async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"email and password are required"
        })
    }
    try{
        const user=await userSchema.findOne({email}).select('+password')

        if(!user || !(bcrypt.compare(password,user.password))){
            return res.status(400).json({
                success:false,
                message:"invalied credentilas"
            })
        }

        const token=user.jwtToken()
        user.password=undefined

        res.cookie('token',token,cookieOption)

        return res.status(200).json({
            success:true,
            data:user
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }
}

const profile=async(req,res)=>{
  const userId=req.user.id
  try{
      const user=await userSchema.findById(userId)
      if(!user){
        return res.status(400).json({
            success:false,
            message:"user id not found"
        })
      }

      return res.status(200).json({
        success:true,
        data:user
      })
  }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
  }
}

const addMedicine=async(req,res)=>{
  const {name,uses_english,uses_hindi}=req.body
  if(!name || !uses_english || !uses_hindi){
    return res.status(400).json({
        success:false,
        message:"all fields are required"
    })
  }

  const userId=req.user.id
  const imageData={}
  const user=await userSchema.findById(userId)
  if(!user){
    return res.status(400).json({
        success:false,
        message:"user id not found"
    })
  }

  if(req.file){
    try{
         const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'medicine'
         })

         if(result){
            imageData.public_id=result.public_id
            imageData.secure_url=result.secure_url
         }
          fs.rm(`pankaj/${req.file.filename}`)
    }catch(e){
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }
  }
  user.medicines.push({
    name,
    uses_english,
    uses_hindi,
    image:imageData
  })

  await user.save()

  return res.status(200).json({
    success:true,
    data:user
  })
}

const search=async(req,res)=>{
  const {name}=req.body
  const email='pankaj19jnp@gmail.com'
  const user=await userSchema.findOne({email})
  try{
    let n;
    const size=user.medicines.length
    for(let i=0;i<size;i++){
      if(await user.medicines[i].name==name){
         n=i;
        break;
      }
    }

      const result=await user.medicines[n]
      
      if(!result){
        return res.status(400).json({
          success:false,
          message:"result not found"
        })
      }

      return res.status(200).json({
        success:true,
        data:result
      })
      


  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

const Logout=(req,res)=>{
  try{
       const cookieOption={
        expires:new Date(),
        httpOnly:true
       }

       res.cookie('token',null,cookieOption)
       return res.status(200).json({
        success:true,
        message:'Logged out'
       })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

module.exports={signup,signin,profile,addMedicine,search,Logout}