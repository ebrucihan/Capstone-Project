import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
  return (
    <div className="home-content">
      {/* Main text content for the Home page */}
      <div className="home-text">
        {/* Header text */}
        <h1 className="home">Online Library</h1>
        {/* Introduction text */}
        <p className="home-intro">
          Discover books, authors, publishers, and categories. Borrow books with
          ease and explore a world of knowledge at your fingertips.
        </p>
        {/* Link button to the borrow books page */}
        <Link to="/borrows" className="btn-learn-more">
          Borrow a book!
        </Link>
      </div>
      {/* Placeholder for the home page image */}
      <div className="home-image"></div>
    </div>
  );
}

export default Home;
