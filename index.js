const express = require("express");
const app = express();
const cors = require("cors"); // Impor middleware cors
require("dotenv").config();

const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const midtransRoutes = require("./src/routes/midtrans.routes");

// Middleware untuk mengizinkan Express mengenali JSON
app.use(express.json());

// Menggunakan middleware cors
app.use(cors());

// Gunakan rute-rute yang telah didefinisikan
app.use(userRoutes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(midtransRoutes);
// Port yang digunakan oleh server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
