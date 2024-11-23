import React, { useState } from "react";
import PublisherService from "../services/PublisherService";
import "../css/Publisher.css";

function Publishers() {
  // State to store the list of publishers, new publisher data, and editing state
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: 0,
    address: "",
  });
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all publishers and display success or error message
  const fetchAllPublishers = async () => {
    try {
      const data = await PublisherService.getPublishers();
      setPublishers(data);
      setMessage("All publishers have been successfully uploaded!");

      // Scroll the page to the bottom after loading
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error(
        "An error occurred while pulling all the publishers:",
        error
      );
      setMessage("An error occurred while pulling all publishers.");
    }
  };

  // Fetch publisher by ID and display corresponding message
  const fetchPublisherById = async () => {
    try {
      const data = await PublisherService.getPublisherById(searchId);
      if (data) {
        setPublishers([data]);
        setMessage(
          `The publishing house with ID ${searchId} was found successfully!`
        );
      } else {
        setMessage(`No publisher found with ID ${searchId}`);
      }
      // Scroll the page to the bottom after search
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error(
        "An error occurred while searching for a publisher:",
        error
      );
      setMessage("An error occurred while searching for a publisher.");
    }
  };

  // Handle input change for both adding and editing publishers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPublisher) {
      setEditingPublisher({ ...editingPublisher, [name]: value });
    } else {
      setNewPublisher({ ...newPublisher, [name]: value });
    }
  };
  // Handle adding a new publisher
  const handleAddPublisher = async (e) => {
    e.preventDefault();
    try {
      const addedPublisher = await PublisherService.addPublisher(newPublisher);
      setPublishers([...publishers, addedPublisher]);
      setNewPublisher({ name: "", establishmentYear: 0, address: "" });
      setMessage("Publisher added successfully!");

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while adding a publisher:", error);
      setMessage("An error occurred while adding a publisher.");
    }
  };
  // Handle clicking on the edit button for a publisher
  const handleEditClick = (publisher) => {
    setEditingPublisher(publisher);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle updating a publisher's information
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
      setMessage("Publisher updated successfully!");
      // Scroll the page to the bottom after updating
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while updating the publisher:", error);
      setMessage("An error occurred while updating the publisher.");
    }
  };
  // Handle deleting a publisher
  const handleDeletePublisher = async (id) => {
    try {
      await PublisherService.deletePublisher(id);
      setPublishers(publishers.filter((publisher) => publisher.id !== id));
      setMessage("Publisher successfully deleted!");

      // Scroll the page to the top after deletion
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while deleting the publisher:", error);
      setMessage("An error occurred while deleting the publisher.");
    }
  };

  return (
    <div className="publisher-content">
      <h1>Publishers</h1>
      {message && (
        <p style={{ color: message.includes("error") ? "red" : "green" }}>
          {message}
        </p>
      )}

      <button onClick={fetchAllPublishers}>View All</button>

      <div>
        <input
          type="text"
          placeholder="Search publisher by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchPublisherById}>Search</button>
      </div>

      <form
        onSubmit={editingPublisher ? handleUpdatePublisher : handleAddPublisher}
      >
        <input
          type="text"
          name="name"
          value={editingPublisher ? editingPublisher.name : newPublisher.name}
          onChange={handleInputChange}
          placeholder="Publisher name"
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
          placeholder="Year of Foundation"
          required
        />
        <input
          type="text"
          name="address"
          value={
            editingPublisher ? editingPublisher.address : newPublisher.address
          }
          onChange={handleInputChange}
          placeholder="Address"
          required
        />
        <button type="submit">{editingPublisher ? "Update" : "Add"}</button>
      </form>

      {publishers.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th> {/* Added ID header */}
              <th>Publisher Name</th>
              <th>Year of Foundation</th>
              <th>Address</th>
              <th>Operations</th>
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
                    Edit
                  </button>
                  <button onClick={() => handleDeletePublisher(publisher.id)}>
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

export default Publishers;
