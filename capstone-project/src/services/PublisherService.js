import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/publishers";

// Tüm yayınevlerini getirmek için GET isteği
const getPublishers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Yayıncıları çekerken hata oluştu:", error);
    throw error;
  }
};

// Belirli bir ID'ye sahip yayınevini getirmek için GET isteği
const getPublisherById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} olan yayınevini çekerken hata oluştu:`, error);
    throw error;
  }
};

// Yeni bir yayıncı eklemek için POST isteği
const addPublisher = async (publisher) => {
  try {
    const response = await axios.post(API_URL, publisher);
    return response.data;
  } catch (error) {
    console.error("Yayıncı eklerken hata oluştu:", error);
    throw error;
  }
};

// Yayıncı güncellemek için PUT isteği
const updatePublisher = async (id, updatedPublisher) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedPublisher);
    return response.data;
  } catch (error) {
    console.error("Yayıncı güncellerken hata oluştu:", error);
    throw error;
  }
};

// Yayıncı silmek için DELETE isteği
const deletePublisher = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Yayıncı silinirken hata oluştu:", error);
    throw error;
  }
};

export default {
  getPublishers, // Tüm yayınevlerini getirir
  getPublisherById, // Belirli bir ID'ye göre yayınevi getirir
  addPublisher,
  updatePublisher,
  deletePublisher,
};
