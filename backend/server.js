const express = require("express");
const PORT = 5000;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const router = express.Router();
const upload = require("./multer");
require("./models/user_models");
require("./models/cart_models");
require("./models/product_models");
require("./models/deals_models");
require("./models/address_model");
require("./models/order_model");
require("./models/category_model");
require("./models/brand_model");
require("./models/review_model");
const userRouter = require("./router/user_routes");
const bodyParser = require("body-parser");
const productRouter = require("./router/product_routes");
const cartRouter = require("./router/cart_routes");
const dealsRouter = require("./router/deals_routers");
const addressRouter = require("./router/address_router");
const orderRouter = require("./router/order_router");
const categoryRouter = require("./router/categories_router");
const brandRouter = require("./router/brand_router");
const reviewRouter = require("./router/review_router");
const { MONGODB_URL, PAYPAL_CLIENT_ID } = require("./config");
const { verifyTokenAuth } = require("./middleware/verifyToken");

app.use(cors());
app.use(express.json());
mongoose.connect(MONGODB_URL);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/api/keys/paypal", (req, res) => {
  res.send(PAYPAL_CLIENT_ID);
});

mongoose.connection.on("connected", () => {
  console.log("DB Connected ");
});
mongoose.connection.on("error", (err) => {
  console.log("Error On mongose ,connenction " + err);
});

// Use the user router for '/user' routes
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/deals", dealsRouter);
app.use("/delivery", addressRouter);
app.use("/order", orderRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/review", reviewRouter);
// Set up the route to serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`server Started on ${PORT}`);
});
