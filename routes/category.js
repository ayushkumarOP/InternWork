const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Category = require('../models/Category');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

cloudinary.config({ 
  cloud_name: 'dyq5psw6x', 
  api_key: '624644449714317', 
  api_secret: 'HqjCZcdztieVJPQbsdAAKTSopzo' 
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads_cat');
  },
  filename: function (req, file, cb) {
    const random = uuidv4(); 
    cb(null, "category" + random + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().select('categoryName -_id');
    const categoryNames = categories.map(category => category.categoryName);
    res.json(categoryNames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/subcategories', async (req, res) => {
  const { category } = req.query;
  try {
    const foundCategory = await Category.findOne({ categoryName: category });
    if (foundCategory) {
      res.json(foundCategory.subcategories);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.post('/addCategory', upload.single('categoryImage'), async (req, res) => {
  console.log('Request Body:', req.body); // Debugging: Check request body
  console.log('File:', req.file); // Debugging: Check uploaded file
  try {
    const { categoryName, subcategories } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    const decodedCategoryName = decodeURIComponent(categoryName);
    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    // Parse and decode subcategories JSON string to an array
    const parsedSubcategories = JSON.parse(subcategories).map(subcategory => decodeURIComponent(subcategory));

    const newCategory = new Category({
      categoryName: categoryName,
      categoryImage: uploadResult.secure_url,
      subcategories: parsedSubcategories, 
    });

    await newCategory.save();

    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
      else console.log('Deleted file');
    });

    res.json({ msg: 'Category added successfully', your_url: { categoryImage: uploadResult.secure_url } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the category' });
  }
});

module.exports = router;