const router = require("express").Router();
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product.js");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

cloudinary.config({ 
    cloud_name: 'dyq5psw6x', 
    api_key: '624644449714317', 
    api_secret: 'HqjCZcdztieVJPQbsdAAKTSopzo' 
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads_pro');
    },
    filename: function (req, file, cb) {
        const random = uuidv4(); 
        cb(null, "products" + random + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/addProduct', upload.single('myfile'), async (req, res) => {
    try {
        const { name, description, variants, category, subcategory, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded' });
        }

        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        const parsedVariants = JSON.parse(variants);

        const newProduct = new Product({
            name: name,
            image: uploadedImage.secure_url,
            description: description,
            variants: parsedVariants,
            category: category,
            subcategory: subcategory,
            price: price 
        });

        await newProduct.save();

        fs.unlink(req.file.path, (err) => {
            if (err) console.log(err);
            else console.log("Deleted file");
        });

        res.json({ msg: "Product added successfully", your_url: { image: uploadedImage.secure_url } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding the product" });
    }
});


router.get('/productsByCategory', async (req, res) => {
    const { categories } = req.query;
    const categoriesArray = categories.split(',');
    try {
        const products = await Product.find({ category: { $in: categoriesArray } });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching products" });
    }
});

router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
