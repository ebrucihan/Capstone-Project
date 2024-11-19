import React, { useState, useEffect } from "react";
import BorrowService from "../services/BorrowService";
import "../css/BookBorrow.css";

function BookBorrow() {
  const [borrows, setBorrows] = useState([]);
  const [newBorrow, setNewBorrow] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    returnDate: "",
    bookForBorrowingRequest: { id: "" },
  });
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchAllBorrows();
  }, []);

  const fetchAllBorrows = async () => {
    try {
      const data = await BorrowService.getAllBorrows();
      setBorrows(data);
      setMessage("All borrow records successfully loaded!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error loading borrow records.");
      setMessageType("error");
    }
  };

  const fetchBorrowById = async () => {
    try {
      const data = await BorrowService.getBorrowById(searchId);
      if (data) {
        setBorrows([data]);
        setMessage("Borrow record found!");
        setMessageType("success");
      } else {
        setMessage("No borrow record found with this ID.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error searching for borrow record.");
      setMessageType("error");
    }
  };

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
      setEditingBorrow({ ...editingBorrow, [name]: value });
    } else {
      setNewBorrow({ ...newBorrow, [name]: value });
    }
  };

  const validateForm = (borrow) => {
    const {
      borrowerName,
      borrowerMail,
      borrowingDate,
      returnDate,
      bookForBorrowingRequest,
    } = borrow;
    if (
      !borrowerName ||
      !borrowerMail ||
      !borrowingDate ||
      !returnDate ||
      !bookForBorrowingRequest.id
    ) {
      setMessage("All fields must be filled!");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleAddBorrow = async (e) => {
    e.preventDefault();
    if (!validateForm(newBorrow)) return;

    try {
      const addedBorrow = await BorrowService.addBorrow(newBorrow);
      setBorrows([...borrows, addedBorrow]);
      setNewBorrow({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        bookForBorrowingRequest: { id: "" },
      });
      setMessage("Borrow record added successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error adding borrow record.");
      setMessageType("error");
    }
  };

  const handleEditClick = (borrow) => {
    setEditingBorrow({
      id: borrow.id,
      borrowerName: borrow.borrowerName,
      borrowerMail: borrow.borrowerMail,
      borrowingDate: borrow.borrowingDate,
      returnDate: borrow.returnDate,
      bookForBorrow,
    });
  };

  const handleUpdateBorrow = async (e) => {
    e.preventDefault();
    if (!validateForm(editingBorrow)) return;

    try {
      const updatedBorrow = await BorrowService.updateBorrow(
        editingBorrow.id,
        editingBorrow
      );
      setBorrows(
        borrows.map((borrow) =>
          borrow.id === updatedBorrow.id ? updatedBorrow : borrow
        )
      );
      setEditingBorrow(null);
      setMessage("Borrow record updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error updating borrow record.");
      setMessageType("error");
    }
  };

  const handleDeleteBorrow = async (id) => {
    try {
      await BorrowService.deleteBorrow(id);
      setBorrows(borrows.filter((borrow) => borrow.id !== id));
      setMessage("Borrow record deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error deleting borrow record.");
      setMessageType("error");
    }
  };

  return (
    <div className="borrow-content">
      <h1>Book Borrow</h1>
      {message && (
        <p
          style={{
            color: messageType === "success" ? "green" : "red",
            fontSize: "18px",
          }}
        >
          {message}
        </p>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="number"
          placeholder="Enter Borrow ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
        />
        <button type="button" onClick={fetchBorrowById}>
          Search by ID
        </button>
        <button type="button" onClick={fetchAllBorrows}>
          Get All Records
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
          required
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
      {borrows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Borrower Name</th>
              <th>Borrower Mail</th>
              <th>Borrowing Date</th>
              <th>Return Date</th>
              <th>Book ID</th>
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
                <td>{borrow.returnDate ? borrow.returnDate : "N/A"}</td>
                <td>{borrow.book?.id || "N/A"}</td>
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
