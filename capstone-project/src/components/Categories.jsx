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
  const [showTable, setShowTable] = useState(false);

  const fetchAllCategories = async () => {
    try {
      const data = await CategoriesService.getCategories();
      setCategories(data);
      setShowTable(true);
      setMessage("All categories have been successfully loaded!");
      // Sayfayı aşağı kaydır
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error(
        "An error occurred while pulling all the categories:",
        error
      );
      setMessage("An error occurred while pulling all categories.");
    }
  };
  const fetchCategoryById = async () => {
    try {
      const data = await CategoriesService.getCategoryById(searchId);
      if (data) {
        setCategories([data]);
        setShowTable(true);
        setMessage(`Category with ID ${searchId} found successfully!`);
      } else {
        setMessage(`No category found with ID ${searchId}`);
      }
      // Sayfayı aşağı kaydır
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while searching for a category:", error);
      setMessage("An error occurred while searching for a category.");
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
      setShowTable(true);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while adding a category:", error);
      setMessage("An error occurred while adding a category.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setShowTable(true);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while updating the category:", error);
      setMessage("An error occurred while updating the category.");
    }
  };
  const handleDeleteCategory = async (id) => {
    try {
      await CategoriesService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      setMessage("Category deleted successfully!");
      setShowTable(true);
      // Sayfayı üst kısma kaydır
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while deleting the category:", error);
      setMessage("An error occurred while deleting the category.");
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

      <button onClick={fetchAllCategories}>View All</button>

      <div>
        <input
          type="text"
          placeholder="Search category by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchCategoryById}>Search</button>
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

      {showTable && categories.length > 0 && (
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
