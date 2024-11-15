import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/books";

// Get all books
const getBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw new Error("Failed to fetch books. Please try again.");
  }
};

// Get book by ID
const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error.message);
    throw new Error(`Failed to fetch book with ID ${id}. Please try again.`);
  }
};

// Add a new book
const addBook = async (book) => {
  try {
    const response = await axios.post(API_URL, book);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error.message);
    throw new Error(
      "Failed to add book. Please check your input and try again."
    );
  }
};

// Update an existing book
const updateBook = async (id, updatedBook) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedBook);
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error.message);
    throw new Error(
      "Failed to update book. Please check your input and try again."
    );
  }
};

// Delete a book
const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting book:", error.message);
    throw new Error("Failed to delete book. Please try again.");
  }
};

export default {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
