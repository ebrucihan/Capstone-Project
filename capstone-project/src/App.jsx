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
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Ana Sayfa</Link>
            </li>
            <li>
              <Link to="/publishers">Yayıncılar</Link>
            </li>
            <li>
              <Link to="/categories">Kategoriler</Link>
            </li>
            <li>
              <Link to="/books">Kitaplar</Link>
            </li>
            <li>
              <Link to="/authors">Yazarlar</Link>
            </li>
            <li>
              <Link to="/borrows">Kitap Alma</Link>
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
