// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Publishers from "./components/Publishers";
import Categories from "./components/Categories";
import Books from "./components/Books";
import Authors from "./components/Authors";
import Borrows from "./components/Borrows";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/publishers" className="nav-link">
                Publishers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/books" className="nav-link">
                Books
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/authors" className="nav-link">
                Authors
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/borrows" className="nav-link">
                Borrowing Books
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/borrows" element={<Borrows />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
