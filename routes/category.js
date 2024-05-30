const router = require("express").Router();
const multer  = require('multer')
const cloudinary= require("cloudinary").v2
const Category = require("../models/Category.js")
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

cloudinary.config({ 
    cloud_name: 'dyq5psw6x', 
    api_key: '624644449714317', 
    api_secret: 'HqjCZcdztieVJPQbsdAAKTSopzo' 
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads_cat')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        const random = uuidv4(); 
      cb(null, "category"+random+""+file.originalname )
    }
  })
const upload = multer({ storage: storage })

router.post('/addCategory', upload.single('myfile'), async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
      const subcategories = req.body.subcategories;

      if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded' });
      }

      const x = await cloudinary.uploader.upload(req.file.path);
  
      const newCategory = new Category({
        categoryName: categoryName,
        categoryImage: x.secure_url ,
        subcategories: subcategories,
      });
  
      await newCategory.save();
  
      fs.unlink(req.file.path, function (err) {
        if (err) console.log(err);
        else console.log("Deleted file");
      });
  
      res.json({ msg: "Category added successfully", your_url:{categoryImage:  x.secure_url} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while adding the category" });
    }
  });

module.exports = router;