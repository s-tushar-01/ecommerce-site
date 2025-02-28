const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./ecommerce.db");

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_items TEXT NOT NULL,
    total_price REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert initial products
  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        { name: "Wireless Headphones", price: 99.99, description: "Noise-canceling", image: "" },
        { name: "Smart Watch", price: 199.99, description: "Fitness tracker", image: "" },
        { name: "Bluetooth Speaker", price: 79.99, description: "Waterproof speaker", image: "" },
      ];

      products.forEach((product) => {
        db.run("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
          [product.name, product.price, product.description, product.image]);
      });
    }
  });
});

// API to get products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to handle checkout
app.post("/checkout", (req, res) => {
  const cart = req.body;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  db.run("INSERT INTO orders (cart_items, total_price) VALUES (?, ?)", [JSON.stringify(cart), total], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order placed successfully!" });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
