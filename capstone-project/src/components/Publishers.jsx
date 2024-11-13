import React, { useState } from "react";
import PublisherService from "../services/PublisherService";

function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: 0,
    address: "",
  });
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [searchId, setSearchId] = useState(""); // Aranacak ID
  const [message, setMessage] = useState("");

  const fetchAllPublishers = async () => {
    try {
      const data = await PublisherService.getPublishers(); // getAllPublishers yerine getPublishers kullanıldı
      setPublishers(data);
      setMessage("Tüm yayınevleri başarıyla yüklendi!");
    } catch (error) {
      console.error("Tüm yayınevlerini çekerken bir hata oluştu:", error);
      setMessage("Tüm yayınevlerini çekerken bir hata oluştu.");
    }
  };

  const fetchPublisherById = async () => {
    try {
      const data = await PublisherService.getPublisherById(searchId);
      if (data) {
        setPublishers([data]); // Sadece aranan ID'ye sahip yayınevini göster
        setMessage(`ID ${searchId} olan yayınevi başarıyla bulundu!`);
      } else {
        setMessage(`ID ${searchId} olan bir yayınevi bulunamadı.`);
      }
    } catch (error) {
      console.error("Yayınevi ararken bir hata oluştu:", error);
      setMessage("Yayınevi ararken bir hata oluştu.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPublisher) {
      setEditingPublisher({ ...editingPublisher, [name]: value });
    } else {
      setNewPublisher({ ...newPublisher, [name]: value });
    }
  };

  const handleAddPublisher = async (e) => {
    e.preventDefault();
    try {
      const addedPublisher = await PublisherService.addPublisher(newPublisher);
      setPublishers([...publishers, addedPublisher]);
      setNewPublisher({ name: "", establishmentYear: 0, address: "" });
      setMessage("Yayıncı başarıyla eklendi!");
    } catch (error) {
      console.error("Yayıncı eklerken bir hata oluştu:", error);
      setMessage("Yayıncı eklenirken bir hata oluştu.");
    }
  };

  const handleEditClick = (publisher) => {
    setEditingPublisher(publisher);
    setMessage("");
  };

  const handleUpdatePublisher = async (e) => {
    e.preventDefault();
    try {
      const updatedPublisher = await PublisherService.updatePublisher(
        editingPublisher.id,
        editingPublisher
      );

      setPublishers(
        publishers.map((publisher) =>
          publisher.id === updatedPublisher.id ? updatedPublisher : publisher
        )
      );
      setEditingPublisher(null);
      setMessage("Yayıncı başarıyla güncellendi!");
    } catch (error) {
      console.error("Yayıncı güncellerken bir hata oluştu:", error);
      setMessage("Yayıncı güncellenirken bir hata oluştu.");
    }
  };

  const handleDeletePublisher = async (id) => {
    try {
      await PublisherService.deletePublisher(id);
      setPublishers(publishers.filter((publisher) => publisher.id !== id));
      setMessage("Yayıncı başarıyla silindi!");
    } catch (error) {
      console.error("Yayıncı silinirken bir hata oluştu:", error);
      setMessage("Yayıncı silinirken bir hata oluştu.");
    }
  };

  return (
    <div>
      <h1>Yayıncılar Sayfası</h1>
      {message && (
        <p style={{ color: message.includes("hata") ? "red" : "green" }}>
          {message}
        </p>
      )}

      <button onClick={fetchAllPublishers}>Tüm Yayınevlerini Getir</button>

      <div>
        <input
          type="text"
          placeholder="ID ile yayınevi ara"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchPublisherById}>ID ile Ara</button>
      </div>

      <form
        onSubmit={editingPublisher ? handleUpdatePublisher : handleAddPublisher}
      >
        <input
          type="text"
          name="name"
          value={editingPublisher ? editingPublisher.name : newPublisher.name}
          onChange={handleInputChange}
          placeholder="Yayıncı adı"
          required
        />
        <input
          type="number"
          name="establishmentYear"
          value={
            editingPublisher
              ? editingPublisher.establishmentYear
              : newPublisher.establishmentYear
          }
          onChange={handleInputChange}
          placeholder="Kuruluş Yılı"
          required
        />
        <input
          type="text"
          name="address"
          value={
            editingPublisher ? editingPublisher.address : newPublisher.address
          }
          onChange={handleInputChange}
          placeholder="Adres"
          required
        />
        <button type="submit">{editingPublisher ? "Güncelle" : "Ekle"}</button>
      </form>

      {publishers.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th> {/* Added ID header */}
              <th>Yayıncı Adı</th>
              <th>Kuruluş Yılı</th>
              <th>Adres</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher) => (
              <tr key={publisher.id}>
                <td>{publisher.id}</td> {/* Displaying the publisher's ID */}
                <td>{publisher.name}</td>
                <td>{publisher.establishmentYear}</td>
                <td>{publisher.address}</td>
                <td>
                  <button onClick={() => handleEditClick(publisher)}>
                    Düzenle
                  </button>
                  <button onClick={() => handleDeletePublisher(publisher.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Publishers;
