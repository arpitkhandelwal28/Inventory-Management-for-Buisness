const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/authRouter');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require("./routes/orderRoutes");

const { connectRedis } = require('./config/redisClient'); // ✅ Redis
const db = require('./config/db'); // ✅ DB Connection

const app = express();
const port = process.env.PORT || 5000;

// ✅ Trust proxy so secure cookies work behind Render proxy
app.set('trust proxy', 1);

// ✅ Redis connection at startup
connectRedis();

// ✅ CORS CONFIGURATION
const allowedOrigins = [
    "https://inventory-management-for-buisness-2.onrender.com",  // Frontend
    "https://inventory-management-for-buisness.onrender.com"     // Backend (optional)
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 204
};

// ✅ Set headers manually (needed on Render sometimes)
app.use((req, res, next) => {
    if (allowedOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

// ✅ Middlewares
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Default route
app.get("/", (req, res) => {
    res.json({ message: "Inventory backend working ✅" });
});

// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

