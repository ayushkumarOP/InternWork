const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category.js")
const productRoute = require("./routes/product.js")
const brandRoute = require("./routes/brand.js");
const orderRoute = require("./routes/order.js");
const quotationRoute = require("./routes/quotation.js");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api", brandRoute);
app.use("/apii", categoryRoute);
app.use("/apu", productRoute);
app.use("/api/orders",orderRoute);
app.use("/api/quotation",quotationRoute);

app.listen(process.env.PORT || 5005, () => {
  console.log("Backend server is running!");
});
