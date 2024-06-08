const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');

router.post('/place-order', async (req, res) => {
    try {
      const { products, total } = req.body;
  
      const newOrder = new Order({
        products,
        total,
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(500).json({ error: 'Failed to place order' });
    }
  });

  
  module.exports = router;