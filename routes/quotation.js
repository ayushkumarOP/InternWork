const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation.js');

router.post('/quotation-request', async (req, res) => {
  try {
    const { products, total, billingDetails } = req.body;

    const newQuotation = new Quotation({
      products,
      total,
      billingDetails,
    });

    const savedQuotation = await newQuotation.save();
    res.status(201).json(savedQuotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit quotation request' });
  }
});

module.exports = router;