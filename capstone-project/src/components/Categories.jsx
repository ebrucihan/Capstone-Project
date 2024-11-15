import React, { useState, useEffect } from "react";
import CategoriesService from "../services/CategoriesService";
import "../css/Category.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false); // Tabloyu gösterme durumu

  const fetchAllCategories = async () => {
    try {
      const data = await CategoriesService.getCategories();
      setCategories(data);
      setShowTable(true); // "Get All Categories" butonuna basıldığında tabloyu göster
      setMessage("All categories have been successfully loaded!");
    } catch (error) {
      console.error("Error loading categories:", error);
      setMessage("Error loading categories.");
    }
  };

  const fetchCategoryById = async () => {
    try {
      const data = await CategoriesService.getCategoryById(searchId);
      if (data) {
        setCategories([data]);
        setShowTable(true); // Tek bir kategori arandığında tabloyu göster
        setMessage(`Category with ID ${searchId} found successfully!`);
      } else {
        setMessage(`No category found with ID ${searchId}`);
      }
    } catch (error) {
      console.error("Error searching for category:", error);
      setMessage("Error searching for category.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const addedCategory = await CategoriesService.addCategory(newCategory);
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: "", description: "" });
      setMessage("Category added successfully!");
      setShowTable(true); // Yeni kategori eklendiğinde tabloyu göster
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Error adding category.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setMessage("");
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = await CategoriesService.updateCategory(
        editingCategory.id,
        editingCategory
      );
      setCategories(
        categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
      setEditingCategory(null);
      setMessage("Category updated successfully!");
      setShowTable(true); // Güncelleme sonrasında tabloyu göster
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Error updating category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await CategoriesService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      setMessage("Category deleted successfully!");
      setShowTable(true); // Silme sonrasında tabloyu göster
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Error deleting category.");
    }
  };

  return (
    <div className="category-content">
      <h1>Categories</h1>
      {message && (
        <p
          style={{
            color: message.toLowerCase().includes("error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}

      <button onClick={fetchAllCategories}>Get All Categories</button>

      <div>
        <input
          type="text"
          placeholder="Search category by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchCategoryById}>Search by ID</button>
      </div>

      <form
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
      >
        <input
          type="text"
          name="name"
          value={editingCategory ? editingCategory.name : newCategory.name}
          onChange={handleInputChange}
          placeholder="Category name"
          required
        />
        <input
          type="text"
          name="description"
          value={
            editingCategory
              ? editingCategory.description
              : newCategory.description
          }
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <button type="submit">{editingCategory ? "Update" : "Add"}</button>
      </form>

      {showTable &&
        categories.length > 0 && ( // Tabloyu yalnızca showTable true olduğunda göster
          <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <button onClick={() => handleEditClick(category)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)}>
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

export default Categories;
