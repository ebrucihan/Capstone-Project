import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/borrows";

const getAllBorrows = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getBorrowById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateBorrow = async (id, updatedBorrow) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedBorrow);
  return response.data;
};

const addBorrow = async (borrow) => {
  const response = await axios.post(API_URL, borrow);
  return response.data;
};

const deleteBorrow = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllBorrows,
  getBorrowById,
  addBorrow,
  updateBorrow,
  deleteBorrow,
};
