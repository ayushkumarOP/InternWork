const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
  total: { type: Number, required: true },
  billingDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
