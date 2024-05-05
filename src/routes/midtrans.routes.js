const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");
require("dotenv").config();

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true untuk Production
  serverKey: process.env.MIDTRANS_SERVER_KEY, // Ganti dengan server key Midtrans Anda
});

router.use(bodyParser.json());

// Endpoint untuk menghasilkan Snap Token
router.post("/generate-snap-token", async (req, res) => {
  try {
    const { orderId, productName, totalPrice, quantity } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice * quantity,
      },
      item_details: [
        {
          id: "item-id-1",
          price: totalPrice,
          quantity: quantity,
          name: productName,
        },
      ],
    };

    const snapToken = await snap.createTransactionToken(parameter);
    res.json({ snapToken });
  } catch (error) {
    console.error("Error generating snap token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
