import axios from "axios";

const API_URL =
  "https://ripe-mamie-patikadev-039fcbfe.koyeb.app/api/v1/borrows";

// GET request to fetch all borrow records
const getAllBorrows = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET request to fetch a specific borrow record by its ID
const getBorrowById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// PUT request to update an existing borrow record
const updateBorrow = async (id, updatedBorrow) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedBorrow);
  return response.data;
};

// POST request to add a new borrow record
const addBorrow = async (borrow) => {
  const response = await axios.post(API_URL, borrow);
  return response.data;
};

// DELETE request to remove a borrow record by its ID
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
