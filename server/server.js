const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const passport = require('./config/passportConfig');
const session = require('express-session');
const authRoutes = require('./routers/authRouter');
const cartRoutes = require('./routers/cartRouter');
const productRoutes = require('./routers/productRouter');
const shopRoutes = require('./routers/shopRouter');
const categoryRoutes = require('./routers/categoryRouter');
const couponRoutes = require('./routers/couponRouter');
const orderRoutes = require('./routers/orderRouter');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
