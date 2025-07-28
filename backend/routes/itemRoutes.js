const express = require('express');
const itemModel = require('../models/itemModel');
const rateLimit = require('express-rate-limit');
const { client } = require('../config/redisClient');

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
router.use(limiter);

// Valid categories
const validCategories = [
  "Electronics", "Clothing", "Footwear", "Home & Kitchen",
  "Grocery", "Health & Personal Care", "Books", "Furniture",
  "Toys", "Sports & Fitness", "Beauty & Fashion", "Automotive",
  "Jewelry", "Office Supplies", "Baby Products"
];

// Create a single item
router.post('/', async (req, res) => {
  try {
    if (!validCategories.includes(req.body.category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const newItem = new itemModel(req.body);
    await newItem.save();

    // Invalidate cache
    const keys = await client.keys('items:*');
    if (keys.length) await client.del(keys);

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk create items
router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Request body must be an array of items" });
    }

    for (const item of req.body) {
      if (!validCategories.includes(item.category)) {
        return res.status(400).json({ error: "Invalid category in one or more items" });
      }
    }

    const newItems = await itemModel.insertMany(req.body, { ordered: false });
    res.status(201).json({ message: "Items added successfully", data: newItems });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all items with Redis caching
router.get('/', async (req, res) => {
  console.time("⏱️ Inventory API Response Time");

  try {
    const {
      search, category, minPrice, maxPrice,
      inStock, sort, page = 1, limit = 10
    } = req.query;

    const cacheKey = `items:${search || 'all'}:${category || 'all'}:${minPrice || '0'}:${maxPrice || 'max'}:${inStock || 'any'}:${sort || 'none'}:${page}:${limit}`;

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.timeEnd("⏱️ Inventory API Response Time");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Sort options
    const sortOptions = {};
    if (sort === 'price_asc') sortOptions.price = 1;
    if (sort === 'price_desc') sortOptions.price = -1;
    if (sort === 'newest') sortOptions.createdAt = -1;

    const items = await itemModel.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalItems = await itemModel.countDocuments(query);

    const response = {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(page),
    };

    await client.setEx(cacheKey, 3600, JSON.stringify(response));
    console.timeEnd("⏱️ Inventory API Response Time");

    res.status(200).json(response);

  } catch (err) {
    console.error("❌ Error in GET /items:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get item by productId with caching
router.get('/:productId', async (req, res) => {
  try {
    const cacheKey = `item:${req.params.productId}`;
    const cached = await client.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const item = await itemModel.findOne({ productId: req.params.productId });
    if (!item) return res.status(404).json({ error: "Item not found" });

    await client.setEx(cacheKey, 3600, JSON.stringify(item));
    res.status(200).json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:productId', async (req, res) => {
  try {
    if (req.body.category && !validCategories.includes(req.body.category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const updated = await itemModel.findOneAndUpdate(
      { productId: req.params.productId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Item not found" });

    await client.del(`item:${req.params.productId}`);
    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/:productId', async (req, res) => {
  try {
    const deleted = await itemModel.findOneAndDelete({ productId: req.params.productId });
    if (!deleted) return res.status(404).json({ error: "Item not found" });

    await client.del(`item:${req.params.productId}`);
    res.status(200).json({ message: "Item deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
