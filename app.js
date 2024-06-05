const express=require('express')
const app=express()
require('dotenv').config()
const database=require('./database/db.js')
const router=require('./router/router.js')
const cookieparser=require('cookie-parser')
const cors=require('cors')
database()

app.use(cors({
    origin:['http://localhost:5173'],
    methods:['GET','POST'],
    credentials:true
}))
app.use(cookieparser())
app.use(express.json())
app.use('/',router)

module.exports=app