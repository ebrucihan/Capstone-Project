import axios from "axios";

const API_URL = "https://nearby-abra-patikadev-11eb29a9.koyeb.app/api/v1/books";

// Get all books
const getBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get book by ID
const getBookById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new book
const addBook = async (book) => {
  const response = await axios.post(API_URL, book);
  return response.data;
};

// Update an existing book
const updateBook = async (id, updatedBook) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedBook);
  return response.data;
};

// Delete a book
const deleteBook = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
