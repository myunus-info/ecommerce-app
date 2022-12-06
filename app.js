require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const port = process.env.port || 5000;
// Database
const connectDB = require('./db/connect');

// Routers
const authRoutes = require('./routes/authRouter');
const userRoutes = require('./routes/userRouter');
const productRoutes = require('./routes/productRouter');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRouter');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // Signed cookie passing jwt secret
app.use(express.static('./public'));
app.use(fileUpload());

app.get('/api/v1', async (req, res) => {
  // console.log(req.cookies);

  console.log('SignedCookies: ', req.signedCookies);
  res.send('e-commerce-api');
});

// App mounts
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
