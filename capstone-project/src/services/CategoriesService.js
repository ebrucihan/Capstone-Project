import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/categories";

// Tüm kategorileri getirmek için GET isteği
const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Belirli bir ID'ye sahip kategoriyi getirmek için GET isteği
const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Yeni bir kategori eklemek için POST isteği
const addCategory = async (category) => {
  try {
    const response = await axios.post(API_URL, category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Kategori güncellemek için PUT isteği
const updateCategory = async (id, updatedCategory) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedCategory);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Kategori silmek için DELETE isteği
const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export default {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
