import React, { useState, useEffect } from "react";
import AuthorsService from "../services/AuthorsService";
import "../css/Author.css";

function Authors() {
  // State variables for authors, new author form data, and editing author
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchId, setSearchId] = useState(""); // ID to search for an author
  const [message, setMessage] = useState(""); // Message for user feedback
  const [showTable, setShowTable] = useState(false); // Show/hide table

  // Fetch all authors from the service
  const fetchAllAuthors = async () => {
    try {
      const data = await AuthorsService.getAuthors();
      setAuthors(data);
      setShowTable(true); //Show table when fetching all authors
      setMessage("All authors have been successfully loaded!");
      // Scroll to the bottom of the page for better visibility
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while pulling all the authors:", error);
      setMessage("An error occurred while pulling all authors.");
    }
  };

  // Fetch a single author by their ID
  const fetchAuthorById = async () => {
    try {
      const data = await AuthorsService.getAuthorById(searchId);
      if (data) {
        setAuthors([data]);
        setShowTable(true); // Show table even for a single author
        setMessage(`Author with ID ${searchId} found successfully!`);
      } else {
        setMessage(`No author found with ID ${searchId}`);
      }

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while searching for a authors:", error);
      setMessage("An error occurred while searching for a authors.");
    }
  };

  // Handle input change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingAuthor) {
      setEditingAuthor({ ...editingAuthor, [name]: value }); // Update editing author
    } else {
      setNewAuthor({ ...newAuthor, [name]: value }); // Update new author form
    }
  };

  // Add a new author
  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const addedAuthor = await AuthorsService.addAuthor(newAuthor);
      setAuthors([...authors, addedAuthor]); // Add to authors list
      setNewAuthor({ name: "", birthDate: "", country: "" }); // Clear the form
      setMessage("Author added successfully!");
      setShowTable(true);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while adding the author:", error);
      setMessage("An error occurred while adding the author.");
    }
  };

  // Handle editing an existing author
  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update an existing author's details
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
      setEditingAuthor(null); // Clear editing state
      setMessage("Author updated successfully!");
      setShowTable(true);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while updating the author:", error);
      setMessage("An error occurred while updating the author.");
    }
  };

  // Delete an author by ID
  const handleDeleteAuthor = async (id) => {
    try {
      await AuthorsService.deleteAuthor(id);
      setAuthors(authors.filter((author) => author.id !== id)); // Remove from list
      setMessage("Author deleted successfully!");
      setShowTable(true);

      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    } catch (error) {
      console.error("An error occurred while deleting the author:", error);
      setMessage("An error occurred while deleting the author.");
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

      <button onClick={fetchAllAuthors}>View All</button>

      <div>
        <input
          type="text"
          placeholder="Search author by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchAuthorById}>Search</button>
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

      {showTable && authors.length > 0 && (
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
                  <button onClick={() => handleEditClick(author)}>Edit</button>
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
