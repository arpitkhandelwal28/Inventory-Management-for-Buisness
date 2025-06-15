const express = require('express');
const helmet = require('helmet') ;
const cors = require('cors') ;
const cookieParser = require("cookie-parser") ;
const authRouter = require('./routes/authRouter');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = process.env.PORT || 5000 ;

app.use(cors({
    origin: "https://inventory-management-for-buisness-2.onrender.com",
    credentials: true,
}));

app.use(helmet())
app.use(cookieParser()) ;
app.use(express.json()) ;
app.use(express.urlencoded({ extended : true})) ;

const db = require('./config/db');

app.use('/api/auth' , authRouter);
app.use('/api/items', itemRoutes);
app.use('/api/admin' , adminRoutes);
app.use("/api/orders", orderRoutes);


app.get('/' , (req , res) => {
    res.json({message:"This is Home route"}) ;
});

app.listen(port , () => {
    console.log(`server listening on port : ${port}`) ;
});