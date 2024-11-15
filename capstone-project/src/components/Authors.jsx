import React, { useState, useEffect } from "react";
import AuthorsService from "../services/AuthorsService";
import "../css/Author.css";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false); // Tabloyu gösterme durumu

  const fetchAllAuthors = async () => {
    try {
      const data = await AuthorsService.getAuthors();
      setAuthors(data);
      setShowTable(true); // "Get All Authors" butonuna basıldığında tabloyu göster
      setMessage("All authors have been successfully loaded!");
    } catch (error) {
      console.error("Error loading authors:", error);
      setMessage("Error loading authors.");
    }
  };

  const fetchAuthorById = async () => {
    try {
      const data = await AuthorsService.getAuthorById(searchId);
      if (data) {
        setAuthors([data]);
        setShowTable(true); // Tek bir yazar arandığında tabloyu göster
        setMessage(`Author with ID ${searchId} found successfully!`);
      } else {
        setMessage(`No author found with ID ${searchId}`);
      }
    } catch (error) {
      console.error("Error searching for author:", error);
      setMessage("Error searching for author.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingAuthor) {
      setEditingAuthor({ ...editingAuthor, [name]: value });
    } else {
      setNewAuthor({ ...newAuthor, [name]: value });
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const addedAuthor = await AuthorsService.addAuthor(newAuthor);
      setAuthors([...authors, addedAuthor]);
      setNewAuthor({ name: "", birthDate: "", country: "" });
      setMessage("Author added successfully!");
      setShowTable(true); // Yeni yazar eklendiğinde tabloyu göster
    } catch (error) {
      console.error("Error adding author:", error);
      setMessage("Error adding author.");
    }
  };

  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setMessage("");
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault();
    try {
      const updatedAuthor = await AuthorsService.updateAuthor(
        editingAuthor.id,
        editingAuthor
      );
      setAuthors(
        authors.map((author) =>
          author.id === updatedAuthor.id ? updatedAuthor : author
        )
      );
      setEditingAuthor(null);
      setMessage("Author updated successfully!");
      setShowTable(true); // Güncelleme sonrasında tabloyu göster
    } catch (error) {
      console.error("Error updating author:", error);
      setMessage("Error updating author.");
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      await AuthorsService.deleteAuthor(id);
      setAuthors(authors.filter((author) => author.id !== id));
      setMessage("Author deleted successfully!");
      setShowTable(true); // Silme sonrasında tabloyu göster
    } catch (error) {
      console.error("Error deleting author:", error);
      setMessage("Error deleting author.");
    }
  };

  return (
    <div className="author-content">
      <h1>Authors</h1>
      {message && (
        <p
          style={{
            color: message.toLowerCase().includes("error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}

      <button onClick={fetchAllAuthors}>Get All Authors</button>

      <div>
        <input
          type="text"
          placeholder="Search author by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchAuthorById}>Search by ID</button>
      </div>

      <form onSubmit={editingAuthor ? handleUpdateAuthor : handleAddAuthor}>
        <input
          type="text"
          name="name"
          value={editingAuthor ? editingAuthor.name : newAuthor.name}
          onChange={handleInputChange}
          placeholder="Author Name"
          required
        />
        <input
          type="date"
          name="birthDate"
          value={editingAuthor ? editingAuthor.birthDate : newAuthor.birthDate}
          onChange={handleInputChange}
          placeholder="Birth Date"
          required
        />
        <input
          type="text"
          name="country"
          value={editingAuthor ? editingAuthor.country : newAuthor.country}
          onChange={handleInputChange}
          placeholder="Country"
          required
        />
        <button type="submit">{editingAuthor ? "Update" : "Add"}</button>
      </form>

      {showTable &&
        authors.length > 0 && ( // Tabloyu yalnızca showTable true olduğunda göster
          <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Author Name</th>
                <th>Birth Date</th>
                <th>Country</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id}>
                  <td>{author.id}</td>
                  <td>{author.name}</td>
                  <td>{author.birthDate}</td>
                  <td>{author.country}</td>
                  <td>
                    <button onClick={() => handleEditClick(author)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAuthor(author.id)}>
                      Delete
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

export default Authors;
