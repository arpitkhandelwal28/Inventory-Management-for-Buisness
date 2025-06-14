const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const itemSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        default: () => uuidv4() 
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Electronics", "Clothing", "Footwear", "Home & Kitchen",
            "Grocery", "Health & Personal Care", "Books", "Furniture",
            "Toys", "Sports & Fitness", "Beauty & Fashion", "Automotive",
            "Jewelry", "Office Supplies", "Baby Products"
        ]
    },
    images: [
        {
            type: String
        }
    ]
}, { timestamps: true }); 

// Optimized Indexes
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ price: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ stock: 1 });

module.exports = mongoose.model('itemModel', itemSchema);