import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/categories";

// Tüm kategorileri getirmek için GET isteği
const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Belirli bir ID'ye sahip kategoriyi getirmek için GET isteği
const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Yeni bir kategori eklemek için POST isteği
const addCategory = async (category) => {
  const response = await axios.post(API_URL, category);
  return response.data;
};

// Kategori güncellemek için PUT isteği
const updateCategory = async (id, updatedCategory) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedCategory);
  return response.data;
};

// Kategori silmek için DELETE isteği
const deleteCategory = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
