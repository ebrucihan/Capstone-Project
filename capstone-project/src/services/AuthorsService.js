import axios from "axios";

// API endpoint URL for authors
const API_URL =
  "https://ripe-mamie-patikadev-039fcbfe.koyeb.app/api/v1/authors";

// GET request to fetch all authors
const getAuthors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET request to fetch a specific author by their ID
const getAuthorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// POST request to add a new author
const addAuthor = async (author) => {
  const response = await axios.post(API_URL, author);
  return response.data;
};

// PUT request to update an existing author's details
const updateAuthor = async (id, updatedAuthor) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedAuthor);
  return response.data;
};

// DELETE request to remove an author by their ID
const deleteAuthor = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Exporting functions to be used elsewhere in the application
export default {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
