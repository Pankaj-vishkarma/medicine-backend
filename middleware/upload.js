const multer=require('multer')
const path=require('path')

const upload=multer({
    dest:'pankaj/',
    limits:{fileSize:50*1024*1024},
    storage:multer.diskStorage({
        destination:'pankaj/',
        filename:(_req,file,cb)=>{
            cb(null,file.originalname)
        }
    }),
    fileFilter:(_req,file,cb)=>{
        let ext=path.extname(file.originalname)

        if(
            ext !== '.jpg' &&
            ext !== '.jpeg' &&
            ext !== '.webp' &&
            ext !== '.png' &&
            ext !== '.mp4'
        ){
            cb(res.status(400).json({
                success:false,
                message:'file not supported'
            }),false)
            return
        }
        cb(null,true)
    }
})

module.exports=upload