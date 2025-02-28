import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const checkout = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setCart([]);
      } else {
        alert("Checkout failed!");
      }
    } catch (error) {
      console.error("Checkout error", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">E-Commerce Store</h1>

      {/* Products Section */}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3" key={product.id}>
            <div className="card">
              <img src={product.image || "https://via.placeholder.com/150"} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price.toFixed(2)}</p>
                <button className="btn btn-primary" onClick={() => addToCart(product)}>
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-5">
        <h2>Cart 🛍️</h2>
        {cart.length === 0 ? <p>No items in cart.</p> : cart.map((item) => (
          <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
            <span>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</span>
            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
        {cart.length > 0 && (
          <div className="mt-3">
            <h4>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h4>
            <button className="btn btn-success" onClick={checkout}>Checkout 💳</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
