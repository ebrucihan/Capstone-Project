import axios from "axios";

const API_URL =
  "https://wet-nicolle-patikadev-1e5d27b5.koyeb.app/api/v1/publishers";

// GET request to fetch all publishers
const getPublishers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET request to fetch a specific publisher by its ID
const getPublisherById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// POST request to add a new publisher
const addPublisher = async (publisher) => {
  const response = await axios.post(API_URL, publisher);
  return response.data;
};

// PUT request to update an existing publisher
const updatePublisher = async (id, updatedPublisher) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedPublisher);
  return response.data;
};

// DELETE request to remove a publisher by its ID
const deletePublisher = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getPublishers,
  getPublisherById,
  addPublisher,
  updatePublisher,
  deletePublisher,
};
