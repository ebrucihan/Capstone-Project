import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/authors";

// Tüm yazarları getirmek için GET isteği
const getAuthors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

// Belirli bir ID'ye sahip yazarı getirmek için GET isteği
const getAuthorById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching author with ID ${id}:`, error);
    throw error;
  }
};

// Yeni bir yazar eklemek için POST isteği
const addAuthor = async (author) => {
  try {
    const response = await axios.post(API_URL, author);
    return response.data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw error;
  }
};

// Yazar güncellemek için PUT isteği
const updateAuthor = async (id, updatedAuthor) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedAuthor);
    return response.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
};

// Yazar silmek için DELETE isteği
const deleteAuthor = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
};

export default {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
