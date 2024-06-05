const app=require('./app.js')
const PORT=process.env.PORT
const {v2}=require('cloudinary')

v2.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret
})

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})