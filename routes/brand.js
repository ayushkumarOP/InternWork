const router = require("express").Router();
const multer  = require('multer')
const cloudinary= require("cloudinary").v2
const Brand = require("../models/Brand.js");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

cloudinary.config({ 
    cloud_name: 'dyq5psw6x', 
    api_key: '624644449714317', 
    api_secret: 'HqjCZcdztieVJPQbsdAAKTSopzo' 
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        const random = uuidv4(); 
      cb(null, random+""+file.originalname )
    }
  })
const upload = multer({ storage: storage })

router.post('/addBrand',upload.single('myfile'),async(req,res)=>{ 
    const x =  await cloudinary.uploader.upload(req.file.path)
    const nami = req.body.name;
    
    const newImage = new Brand({ name: nami, Image_Url: x.secure_url });

    await newImage.save();

    fs.unlink((req.file.path),function(err) {
        if (err) console.log(err);
        else {
            console.log("\nDeleted file");
        }
    })

    res.json({
        msg:"file uploaded",
        your_url:{Image_Url:x.secure_url}
    })
})

module.exports = router;

