import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "./components/Loading.jsx";
import Product from "./screens/Product.jsx";
import ProductDetails from "./screens/ProductDetails";
import { auth } from "./config/firebase-config.js";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [getUser, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false); // Set loading state to false after auth state is determined
    });
    return () => unsubscribe();
  }, []); // Empty dependency array to run effect only once

  if (isLoading) {
    return <Loading />; // Return loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}
