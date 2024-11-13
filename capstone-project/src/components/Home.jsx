import React from "react";
import "../css/Home.css";

function Home() {
  return (
    <div className="home-content">
      <div className="home-text">
        <h1 className="home">Online Library</h1>
        <p className="home-intro">
          Discover books, authors, publishers, and categories. Borrow books with
          ease and explore a world of knowledge at your fingertips.
        </p>
        <a href="#" className="btn-learn-more">
          Learn More
        </a>
      </div>
      <div className="home-image"></div>
    </div>
  );
}

export default Home;
