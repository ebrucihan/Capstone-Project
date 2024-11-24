import axios from "axios";

const API_URL =
  "https://wet-nicolle-patikadev-1e5d27b5.koyeb.app/api/v1/categories";

// GET request to fetch all categories
const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET request to fetch a specific category by its ID
const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// POST request to add a new category
const addCategory = async (category) => {
  const response = await axios.post(API_URL, category);
  return response.data;
};

// PUT request to update an existing category
const updateCategory = async (id, updatedCategory) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedCategory);
  return response.data;
};

// DELETE request to remove a category by its ID
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
