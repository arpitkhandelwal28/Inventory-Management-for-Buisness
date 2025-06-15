const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/authRouter');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = process.env.PORT || 5000;

const db = require('./config/db');

// CORS OPTIONS FULLY FIXED:
const corsOptions = {
    origin: [
        "https://inventory-management-for-buisness-2.onrender.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
    optionsSuccessStatus: 204
};

// CORS MIDDLEWARE
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // important for preflight requests

// Security middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api/auth', authRouter);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({ message: "This is Home route" });
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
