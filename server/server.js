const express = require('express');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));


const authRoutes = require('./routers/authRouter');
const authPort = process.env.AUTH_PORT || 5001;
authRoutes.listen(authPort, () => {
  console.log(`AuthPort: ${authPort}`)
})


const cartRoutes = require('./routers/cartRouter');
const cartPort = process.env.CART_PORT || 5002;
cartRoutes.listen(cartPort, () => {
  console.log(`CartPort: ${cartPort}`)
})

const productRoutes = require('./routers/productRouter');
const productPort = process.env.PRODUCT_PORT || 5003;
productRoutes.listen(productPort, () => {
  console.log(`ProductPort: ${productPort}`)
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
