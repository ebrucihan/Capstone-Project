import axios from "axios";

const API_URL =
  "https://nearby-abra-patikadev-11eb29a9.koyeb.app/api/v1/publishers";

const getPublishers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getPublisherById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const addPublisher = async (publisher) => {
  const response = await axios.post(API_URL, publisher);
  return response.data;
};

const updatePublisher = async (id, updatedPublisher) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedPublisher);
  return response.data;
};

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
