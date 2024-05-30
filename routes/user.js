const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'elsie94@ethereal.email',
      pass: 'JkzzTpYfejtfPtV6Pc'
  }
});


const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = { from: 'elsie94@ethereal.email', to, subject, text};
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};


//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    lastname:req.body.lastname,  
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    ConfirmPassword: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.email } // Assuming 'email' field will hold either email or username
      ]
    });

    if (!user) {
      return res.status(401).json("Wrong email or username");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;

    if (originalPassword !== inputPassword) {
      return res.status(401).json("Wrong Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/alldata", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User Status Approval
router.put('/:userId/update-status', async (req, res) => {
  const userId = req.params.userId;
  const { status } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.status !== status && (status === 'Approved' || status === 'Rejected')) {
      await sendEmail(user.email, `Your status has been updated to ${status}`, `Your account status is now ${status}`);
    }

    user.status = status;
    await user.save();
    res.json({ message: 'Status updated successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
    console.log(err);
  }
});

// User name and lastname update
router.put('/:userId/update-name', async (req, res) => {
  const userId = req.params.userId;
  const { name,lastname } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.lastname=lastname;
    await user.save();
    res.json({ message: 'User updated successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
    console.log(err);
  }
});

// Delete a user by ID
router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user document by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;