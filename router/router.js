const express=require('express')
const router=express.Router()
const {signup, signin, profile, addMedicine, search, Logout}=require('../controller/controller.js')
const isLogin = require('../middleware/isLogin.js')
const upload = require('../middleware/upload.js')
const authorised = require('../middleware/authorised.js')
router.post('/signup',signup)
router.post('/signin',signin)
router.get('/profile',isLogin,profile)
router.post('/addmedicine',isLogin,authorised("ADMIN"),upload.single('image'),addMedicine)
router.post('/search',search)
router.get('/logout',isLogin,Logout)

module.exports=router