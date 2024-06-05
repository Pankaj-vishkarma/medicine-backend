const mongoose=require('mongoose')
const {Schema}=mongoose
const JWT=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    },
    medicines:[
        {
           name:{
            type:String
           },
           uses_english:{
            type:String
           },
           uses_hindi:{
            type:String
           },
           image:{
            public_id:{
                type:String
            },
            secure_url:{
                type:String
            }
           }
           
        },
    ]
},
{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        return next()
    this.password=await bcrypt.hash(this.password,10)
        return next()
})

userSchema.methods={
    jwtToken(){
       return JWT.sign(
        {id:this._id,email:this.email,role:this.role},
        process.env.SECRET,
        {expiresIn:'24h'}
       )
    }
}

module.exports=mongoose.model('medicine',userSchema)