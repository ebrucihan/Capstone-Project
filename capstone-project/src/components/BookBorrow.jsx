import React, { useState, useEffect } from "react";
import BorrowService from "../services/BorrowService";
import BooksService from "../services/BooksService";
import "../css/BookBorrow.css";

function BookBorrow() {
  const [borrows, setBorrows] = useState([]); // Holds all borrow records
  const [newBorrow, setNewBorrow] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    returnDate: "",
    bookForBorrowingRequest: { id: "" },
  }); // Stores input data for a new borrow
  const [editingBorrow, setEditingBorrow] = useState(null); // Tracks which borrow is being edited
  const [searchId, setSearchId] = useState(""); // Stores the ID for search functionality
  const [message, setMessage] = useState(""); // Stores messages to display to the user
  const [messageType, setMessageType] = useState(""); // Defines the type of message (e.g., success or error)
  const [showTable, setShowTable] = useState(false); // Controls the visibility of the borrow records table

  // Fetches all borrow records
  const fetchAllBorrows = async () => {
    try {
      const data = await BorrowService.getAllBorrows();
      setBorrows(data); // Updates the borrow records state
      setShowTable(true); // Shows the table after loading records
      showMessage("All borrow records successfully loaded!", "success");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while pulling all the borrows:", error);
      setMessage("An error occurred while pulling all borrows.");
    }
  };

  // Fetches a specific borrow record by ID
  const fetchBorrowById = async () => {
    try {
      const data = await BorrowService.getBorrowById(searchId);
      if (data) {
        setBorrows([data]);
        showMessage(
          `Book borrow with ID ${searchId} found successfully!`,
          "success"
        );
        setShowTable(true);

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else {
        showMessage("No borrow record found with this ID.", "error");
        setShowTable(false);
      }
    } catch (error) {
      showMessage("Error searching for borrow record.", "error");
      setShowTable(false);
    }
  };

  // Displays a temporary message to the user
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Handles changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "bookId") {
      setNewBorrow({
        ...newBorrow,
        bookForBorrowingRequest: {
          ...newBorrow.bookForBorrowingRequest,
          id: parseInt(value),
        },
      });
    } else if (editingBorrow) {
      // Updates the state of the currently edited borrow
      setEditingBorrow({ ...editingBorrow, [name]: value });
    } else {
      // Updates the new borrow state
      setNewBorrow({ ...newBorrow, [name]: value });
    }
  };

  // Validates the borrow form before submission
  const validateForm = (borrow, isUpdate) => {
    const {
      borrowerName,
      borrowerMail,
      borrowingDate,
      bookForBorrowingRequest,
      returnDate,
    } = borrow;

    // Checks if required fields are not empty
    if (
      !borrowerName.trim() ||
      !borrowerMail.trim() ||
      !borrowingDate.trim() ||
      !bookForBorrowingRequest.id
    ) {
      showMessage("All fields must be filled!", "error");
      return false;
    }

    if (isUpdate && returnDate.trim() && !borrowerName.trim()) {
      showMessage("Return Date is required if you want to update it!", "error");
      return false;
    }

    return true;
  };

  // Handles adding a new borrow record
  const handleAddBorrow = async (e) => {
    e.preventDefault();
    if (!validateForm(newBorrow, false)) return;

    const bookId = newBorrow.bookForBorrowingRequest.id;

    try {
      const book = await BooksService.getBookById(bookId);

      if (book.stock <= 0) {
        showMessage(
          "There is no stock of books left, you cannot borrow them.",
          "error"
        );
        return;
      }

      // Adds the borrow record if stock is sufficient
      const addedBorrow = await BorrowService.addBorrow(newBorrow);
      setBorrows([...borrows, addedBorrow]);
      setNewBorrow({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        bookForBorrowingRequest: { id: "" },
      }); // Resets the form
      showMessage("Borrowing record added successfully!", "success");
      setShowTable(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      showMessage("An error occurred: ", "error");
    }
  };

  // Prepares a borrow record for editing
  const handleEditClick = (borrow) => {
    setEditingBorrow({
      id: borrow.id,
      borrowerName: borrow.borrowerName,
      borrowerMail: borrow.borrowerMail,
      borrowingDate: borrow.borrowingDate,
      returnDate: borrow.returnDate || "",
      bookForBorrowingRequest: { id: borrow.book?.id || "" },
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top for the form
  };

  // Handles updating an existing borrow record
  const handleUpdateBorrow = async (e) => {
    e.preventDefault();

    // Ensures the email cannot be changed
    const originalBorrow = borrows.find(
      (borrow) => borrow.id === editingBorrow.id
    );
    if (editingBorrow.borrowerMail !== originalBorrow?.borrowerMail) {
      showMessage("Email address cannot be updated!", "error");
      return;
    }
    // Validates the edit form
    if (!validateForm(editingBorrow, true)) return;

    if (
      editingBorrow.returnDate.trim() &&
      new Date(editingBorrow.returnDate) < new Date(editingBorrow.borrowingDate)
    ) {
      showMessage(
        "Return date cannot be earlier than borrowing date!",
        "error"
      );
      return;
    }

    try {
      const updateData = {
        borrowerName: editingBorrow.borrowerName,
        borrowingDate: editingBorrow.borrowingDate,
      };

      if (editingBorrow.returnDate.trim()) {
        updateData.returnDate = editingBorrow.returnDate;
      }

      const updatedBorrow = await BorrowService.updateBorrow(
        editingBorrow.id,
        updateData
      );
      // Updates the state with the edited borrow record
      setBorrows(
        borrows.map((borrow) =>
          borrow.id === updatedBorrow.id ? updatedBorrow : borrow
        )
      );

      setEditingBorrow(null);

      showMessage("Borrow record updated successfully!", "success");
      setShowTable(true);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      showMessage("Error updating borrow record.", "error");
    }
  };

  // Deletes a borrow record
  const handleDeleteBorrow = async (id) => {
    try {
      await BorrowService.deleteBorrow(id);
      setBorrows(borrows.filter((borrow) => borrow.id !== id));
      showMessage("Borrow record deleted successfully!", "success");
      setShowTable(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showMessage("Error deleting borrow record.", "error");
    }
  };

  return (
    <div className="borrow-content">
      <h1>Book Borrow</h1>
      {message && (
        <p
          className={`message ${messageType}`}
          style={{
            color: messageType === "error" ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <input
          type="number"
          placeholder="Enter Borrow ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
        />
        <button type="button" onClick={fetchBorrowById}>
          Search
        </button>
        <button type="button" onClick={fetchAllBorrows}>
          View All
        </button>
      </form>

      <form onSubmit={editingBorrow ? handleUpdateBorrow : handleAddBorrow}>
        <input
          type="text"
          name="borrowerName"
          value={
            editingBorrow ? editingBorrow.borrowerName : newBorrow.borrowerName
          }
          onChange={handleInputChange}
          placeholder="Borrower Name"
          required
        />
        <input
          type="email"
          name="borrowerMail"
          value={
            editingBorrow ? editingBorrow.borrowerMail : newBorrow.borrowerMail
          }
          onChange={handleInputChange}
          placeholder="Borrower Mail"
          required
        />
        <input
          type="date"
          name="borrowingDate"
          value={
            editingBorrow
              ? editingBorrow.borrowingDate
              : newBorrow.borrowingDate
          }
          onChange={handleInputChange}
          placeholder="Borrowing Date"
          required
        />
        <input
          type="date"
          name="returnDate"
          value={
            editingBorrow ? editingBorrow.returnDate : newBorrow.returnDate
          }
          onChange={handleInputChange}
          placeholder="Return Date"
        />
        <input
          type="number"
          name="bookId"
          value={
            editingBorrow
              ? editingBorrow.bookForBorrowingRequest.id
              : newBorrow.bookForBorrowingRequest.id
          }
          onChange={handleInputChange}
          placeholder="Book ID"
          required
        />
        <button type="submit">{editingBorrow ? "Update" : "Add"}</button>
      </form>

      {/* The table is only shown when the data arrives and View All or Add is clicked */}
      {showTable && borrows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Borrower Name</th>
              <th>Borrower Mail</th>
              <th>Borrowing Date</th>
              <th>Return Date</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.id}</td>
                <td>{borrow.borrowerName}</td>
                <td>{borrow.borrowerMail}</td>
                <td>{borrow.borrowingDate}</td>
                <td>{borrow.returnDate || "Not Returned"}</td>
                <td>
                  <button onClick={() => handleEditClick(borrow)}>Edit</button>
                  <button onClick={() => handleDeleteBorrow(borrow.id)}>
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

export default BookBorrow;
