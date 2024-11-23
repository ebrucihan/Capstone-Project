import axios from "axios";

const API_URL =
  "https://nearby-abra-patikadev-11eb29a9.koyeb.app/api/v1/authors";

// Tüm yazarları getirmek için GET isteği
const getAuthors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Belirli bir ID'ye sahip yazarı getirmek için GET isteği
const getAuthorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Yeni bir yazar eklemek için POST isteği
const addAuthor = async (author) => {
  const response = await axios.post(API_URL, author);
  return response.data;
};

// Yazar güncellemek için PUT isteği
const updateAuthor = async (id, updatedAuthor) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedAuthor);
  return response.data;
};

// Yazar silmek için DELETE isteği
const deleteAuthor = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
