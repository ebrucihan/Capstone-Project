import React, { useState, useEffect } from "react";
import BooksService from "../services/BooksService";
import AuthorsService from "../services/AuthorsService";
import PublishersService from "../services/PublisherService";
import CategoriesService from "../services/CategoriesService";
import "../css/Book.css";

function Books() {
  const [books, setBooks] = useState([]);
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
  const [messageType, setMessageType] = useState("");
  const [searchId, setSearchId] = useState("");
  const [tableVisible, setTableVisible] = useState(false);
  useEffect(() => {
    fetchAllAuthors();
    fetchAllPublishers();
    fetchAllCategories();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const data = await BooksService.getBooks();
      setBooks(data);
      setMessage("All books have been successfully loaded!");
      setMessageType("success");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while pulling all the books:", error);
      setMessage("An error occurred while pulling all books.");
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
    if (!newBook.name || !newBook.publicationYear || !newBook.stock) {
      setMessage("All fields must be filled!");
      setMessageType("error");
      return;
    }
    if (
      !newBook.author.id ||
      !newBook.publisher.id ||
      newBook.categories.length === 0
    ) {
      setMessageType("error");
      return;
    }
    try {
      const addedBook = await BooksService.addBook(newBook);

      await fetchAllBooks();

      setTableVisible(true);

      setNewBook({
        name: "",
        publicationYear: 0,
        stock: 0,
        author: { id: "" },
        publisher: { id: "" },
        categories: [],
      });

      // Başarı mesajı göster
      setMessage("Book added successfully!");
      setMessageType("success");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while adding the book:", error);
      setMessage("An error occurred while adding the book.");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });

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

    if (!newBook.name || !newBook.publicationYear || !newBook.stock) {
      setMessage("All fields must be filled!");
      setMessageType("error");
      return;
    }

    try {
      // API üzerinden kitabı güncelle
      const updatedBook = await BooksService.updateBook(
        editingBook.id,
        newBook
      );

      // Güncellenen kitabı tabloya direkt olarak yansıt
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === editingBook.id ? { ...book, ...updatedBook } : book
        )
      );

      // Formu sıfırla
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
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while updating the book:", error);
      setMessage("An error occurred while updating the book.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await BooksService.deleteBook(id);
      const remainingBooks = books.filter((book) => book.id !== id);
      setBooks(remainingBooks);
      setMessage("Book deleted successfully!");
      setMessageType("success");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while deleting the book:", error);
      setMessage("An error occurred while deleting the book.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchBook = async () => {
    if (!searchId) {
      setMessage("Please enter a book ID.");
      setMessageType("error");
      return;
    }
    try {
      const foundBook = await BooksService.getBookById(searchId);
      if (foundBook) {
        setBooks([foundBook]); // Sadece bulunan kitabı gösteriyoruz
        setMessage(`Book with ID ${searchId} found successfully!`);
        setMessageType("success");
      } else {
        setMessage(`No book found with ID ${searchId}!`);
        setMessageType("error");
        setBooks([]);
      }
      setTableVisible(true); // Tabloyu görünür yap
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while searching for a book:", error);
      setMessage("An error occurred while searching for a book.");
    }
  };

  const handleGetAllBooks = async () => {
    await fetchAllBooks();
    setTableVisible(true); // Tablonun görünür olmasını sağlıyoruz
  };
  return (
    <div className="book-content">
      <h1>Books</h1>
      {message && (
        <p
          style={{
            color: messageType === "error" ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}

      <div className="get-all-section">
        <button onClick={handleGetAllBooks}>View All</button>
      </div>
      <br />
      <div className="search-section">
        <input
          type="number"
          value={searchId}
          onChange={handleSearchChange}
          placeholder="Enter Book ID"
        />
        <button onClick={handleSearchBook}>Search</button>
      </div>

      <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
        <div className="form-group">
          <label>Book Name</label>
          <input
            type="text"
            name="name"
            value={newBook.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={newBook.stock}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <select
            name="authorId"
            value={newBook.author.id}
            onChange={handleInputChange}
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
            multiple
            value={newBook.categories.map((cat) => cat.id)}
            onChange={handleInputChange}
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

      {tableVisible && (
        <div className="books-list">
          <table>
            <thead>
              <tr>
                <th>ID</th> {/* ID başlığı eklendi */}
                <th>Book Name</th>
                <th>Publication Year</th>
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
                  <td>{book.id}</td> {/* ID değeri burada gösteriliyor */}
                  <td>{book.name}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.stock}</td>
                  <td>{book.author.name}</td>
                  <td>{book.publisher.name}</td>
                  <td>{book.categories.map((cat) => cat.name).join(", ")}</td>
                  <td>
                    <button onClick={() => handleEditClick(book)}>Edit</button>
                    <button onClick={() => handleDeleteClick(book.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Books;
