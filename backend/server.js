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

// ✅ Trust proxy so secure cookies work behind Render proxy
app.set('trust proxy', 1);

// ✅ CORS CONFIGURATION FULLY PRODUCTION READY
const allowedOrigins = [
    "https://inventory-management-for-buisness-2.onrender.com",   // frontend deployed URL
    "https://inventory-management-for-buisness.onrender.com"      // backend deployed URL (for safety)
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Security middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Default test route
app.get('/', (req, res) => {
    res.json({ message: "This is Home route" });
});

// ✅ Start server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
