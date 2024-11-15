import React, { useState, useEffect } from "react";
import BooksService from "../services/BooksService";
import AuthorsService from "../services/AuthorsService";
import PublishersService from "../services/PublisherService";
import CategoriesService from "../services/CategoriesService";
import "../css/Book.css";

function Books() {
  const [books, setBooks] = useState([]); // Books list initially empty
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: 0,
    stock: 0,
    author: { id: "" },
    publisher: { id: "" },
    categories: [],
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [searchId, setSearchId] = useState(""); // State for the ID input field

  useEffect(() => {
    fetchAllAuthors();
    fetchAllPublishers();
    fetchAllCategories();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const data = await BooksService.getBooks();
      setBooks(data);
      setMessage("All books loaded.");
      setMessageType("success");
    } catch (error) {
      setMessage("Error loading books.");
      setMessageType("error");
    }
  };

  const fetchAllAuthors = async () => {
    try {
      const data = await AuthorsService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };

  const fetchAllPublishers = async () => {
    try {
      const data = await PublishersService.getPublishers();
      setPublishers(data);
    } catch (error) {
      console.error("Error loading publishers:", error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const data = await CategoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "authorId") {
      setNewBook({ ...newBook, author: { id: parseInt(value) } });
    } else if (name === "publisherId") {
      setNewBook({ ...newBook, publisher: { id: parseInt(value) } });
    } else if (name === "categoryIds") {
      const selectedCategories = Array.from(
        e.target.selectedOptions,
        (option) => ({ id: parseInt(option.value) })
      );
      setNewBook({ ...newBook, categories: selectedCategories });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const addedBook = await BooksService.addBook(newBook);
      setBooks([...books, addedBook]);
      setNewBook({
        name: "",
        publicationYear: 0,
        stock: 0,
        author: { id: "" },
        publisher: { id: "" },
        categories: [],
      });
      setMessage("Book added successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error adding book.");
      setMessageType("error");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setNewBook({
      name: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      author: book.author || { id: "" },
      publisher: book.publisher || { id: "" },
      categories: book.categories || [],
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = await BooksService.updateBook(
        editingBook.id,
        newBook
      );
      setBooks(
        books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      );
      setEditingBook(null);
      setNewBook({
        name: "",
        publicationYear: 0,
        stock: 0,
        author: { id: "" },
        publisher: { id: "" },
        categories: [],
      });
      setMessage("Book updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error updating book.");
      setMessageType("error");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await BooksService.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
      setMessage("Book deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error deleting book.");
      setMessageType("error");
    }
  };

  // New function to handle search by ID
  const handleSearchById = async (e) => {
    e.preventDefault();
    try {
      const book = await BooksService.getBookById(searchId);
      setBooks([book]); // Display only the searched book
      setMessage("Book found!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error fetching book by ID.");
      setMessageType("error");
    }
  };

  return (
    <div className="book-content">
      <h1>Books</h1>
      {message && (
        <p
          style={{
            color: messageType === "success" ? "green" : "red",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {message}
        </p>
      )}
      {/* Search by ID and Get All Books Section */}
      <form onSubmit={handleSearchById} className="search-section">
        <input
          type="number"
          placeholder="Enter Book ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
        />
        <button type="submit">Search by ID</button>
        <button type="button" onClick={fetchAllBooks}>
          Get All Books
        </button>
      </form>

      {/* Add/Edit Book Form */}
      <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
        <div className="form-group">
          <label>Book Name</label>
          <input
            type="text"
            name="name"
            value={newBook.name}
            onChange={handleInputChange}
            placeholder="Book Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={handleInputChange}
            placeholder="Publication Year"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={newBook.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            required
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <select
            name="authorId"
            value={newBook.author.id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Publisher</label>
          <select
            name="publisherId"
            value={newBook.publisher.id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Publisher</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Categories</label>
          <select
            name="categoryIds"
            value={newBook.categories.map((cat) => cat.id)}
            onChange={handleInputChange}
            multiple
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{editingBook ? "Update" : "Add"}</button>
      </form>

      {/* Conditional rendering for the table */}
      {books.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Year</th>
              <th>Stock</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Categories</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.publicationYear}</td>
                <td>{book.stock}</td>
                <td>{book.author?.name || "N/A"}</td>
                <td>{book.publisher?.name || "N/A"}</td>
                <td>
                  {book.categories && book.categories.length > 0
                    ? book.categories.map((cat) => cat.name).join(", ")
                    : "N/A"}
                </td>
                <td>
                  <button onClick={() => handleEditClick(book)}>Edit</button>
                  <button onClick={() => handleDeleteBook(book.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Books;
