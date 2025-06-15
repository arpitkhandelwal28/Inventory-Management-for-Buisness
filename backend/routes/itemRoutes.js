const express = require('express');
const itemModel = require('../models/itemModel');
const redis = require('redis');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const client = redis.createClient({
     url: process.env.REDIS_URL,
    socket: {
    tls: true,
    rejectUnauthorized: false  // for Upstash
  }
});

client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
  });
  
  (async () => {
    try {
      if (!client.isOpen) {
        await client.connect();
        console.log("✅ Redis Connected Successfully!");
      }
    } catch (err) {
      console.error("❌ Redis Connection Failed:", err);
    }
  })();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  router.use(limiter);

  // Valid categories
const validCategories = [
    "Electronics", "Clothing", "Footwear", "Home & Kitchen",
    "Grocery", "Health & Personal Care", "Books", "Furniture",
    "Toys", "Sports & Fitness", "Beauty & Fashion", "Automotive",
    "Jewelry", "Office Supplies", "Baby Products"
  ];

   // Ensure Redis client is connected before any operation
   async function ensureRedisConnected() {
    if (!client.isOpen) await client.connect();
   }

// Create an item
router.post('/', async (req, res) => {
    try {
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({ error: "Invalid category" });
        }
        const newItem = new itemModel(req.body);
        await newItem.save();

        await ensureRedisConnected();
        const keys = await client.keys('items:*');
        if (keys.length) await client.del(keys);

        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create multiple items
router.post('/bulk', async (req, res) => {
    try {
        // Ensure the request body is an array
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ error: "Request body must be an array of items" });
        }
        for (const item of req.body) {
            if (!validCategories.includes(item.category)) {
              return res.status(400).json({ error: "Invalid category in one or more items" });
            }
        }

        // Insert multiple items
        const newItems = await itemModel.insertMany(req.body, { ordered: false });
        res.status(201).json({ message: "Items added successfully", data: newItems });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all items with caching
router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, inStock, sort, page = 1, limit = 10 } = req.query;
        const cacheKey = `items:${search || 'all'}:${category || 'all'}:${minPrice || '0'}:${maxPrice || 'max'}:${inStock || 'any'}:${sort || 'none'}:${page}:${limit}`; 

        
        await ensureRedisConnected();

        const cachedData = await client.get(cacheKey);
        if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
        }

        const query = {};
        if (search) {
            try{
                query.$text = { $search: search };
            } catch{
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                  ];
                }
            }
        
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (inStock === 'true') query.stock = { $gt: 0 };

        let sortOptions = {};
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
        res.status(200).json(response);
        
    
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
});

// Get an item by productId with caching
router.get('/:productId', async (req, res) => {
    try {
        const cacheKey = `item:${req.params.productId}`;

        await ensureRedisConnected();

        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        
        const item = await itemModel.findOne({ productId: req.params.productId });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        await client.setEx(cacheKey, 3600, JSON.stringify(item));
        res.status(200).json(item);
            
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an item by productId and clear cache
router.put('/:productId', async (req, res) => {
    try {
        if (req.body.category && !validCategories.includes(req.body.category)) {
            return res.status(400).json({ error: "Invalid category" });
        }
        const updatedItem = await itemModel.findOneAndUpdate(
            { productId: req.params.productId }, 
            req.body, 
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });

        await ensureRedisConnected();
        await client.del(`item:${req.params.productId}`); // Clear cache for updated item

        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an item by productId and clear cache
router.delete('/:productId', async (req, res) => {
    try {
        const deletedItem = await itemModel.findOneAndDelete({ productId: req.params.productId });
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });

        await ensureRedisConnected();
        await client.del(`item:${req.params.productId}`); // Clear cache for deleted item

        res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;