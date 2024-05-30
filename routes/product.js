const router = require("express").Router();
const multer  = require('multer')
const cloudinary= require("cloudinary").v2
const Product = require("../models/Product.js")
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

cloudinary.config({ 
    cloud_name: 'dyq5psw6x', 
    api_key: '624644449714317', 
    api_secret: 'HqjCZcdztieVJPQbsdAAKTSopzo' 
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads_pro')
    },
    filename: function (req, file, cb) {
        const random = uuidv4(); 
      cb(null, "products"+random+""+file.originalname )
    }
  })
const upload = multer({ storage: storage })

router.post('/addProduct', upload.single('myfile'), async (req, res) => {
    try {
        const { name, description, variants } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded' });
        }

        const x = await cloudinary.uploader.upload(req.file.path);
        const parsedVariants = JSON.parse(variants); 
    
        const newProduct = new Product({
            name: name,
            image: x.secure_url ,
            description: description,
            variants: parsedVariants
        });
    
        await newProduct.save();
    
        fs.unlink(req.file.path, function (err) {
            if (err) console.log(err);
            else console.log("Deleted file");
        });
    
        res.json({ msg: "Product added successfully", your_url:{image: x.secure_url} });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding the category" });
        }
  });

module.exports = router;

