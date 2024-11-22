import React, { useState, useEffect } from "react";
import BorrowService from "../services/BorrowService";
import BooksService from "../services/BooksService";
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
  const [showTable, setShowTable] = useState(false);

  const fetchAllBorrows = async () => {
    try {
      const data = await BorrowService.getAllBorrows();
      setBorrows(data);
      setShowTable(true);
      showMessage("All borrow records successfully loaded!", "success");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("An error occurred while pulling all the borrows:", error);
      setMessage("An error occurred while pulling all borrows.");
    }
  };

  const fetchBorrowById = async () => {
    try {
      const data = await BorrowService.getBorrowById(searchId);
      if (data) {
        setBorrows([data]);
        showMessage(
          `Book borrow with ID ${searchId} found successfully!`,
          "success"
        );
        setShowTable(true); // ID ile arama yapıldığında tabloyu göster

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else {
        showMessage("No borrow record found with this ID.", "error");
        setShowTable(false); // Kayıt bulunmazsa tabloyu gizle
      }
    } catch (error) {
      showMessage("Error searching for borrow record.", "error");
      setShowTable(false); // Hata olursa tabloyu gizle
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
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

  const validateForm = (borrow, isUpdate) => {
    const {
      borrowerName,
      borrowerMail,
      borrowingDate,
      bookForBorrowingRequest,
      returnDate,
    } = borrow;

    if (
      !borrowerName.trim() ||
      !borrowerMail.trim() ||
      !borrowingDate.trim() ||
      !bookForBorrowingRequest.id
    ) {
      showMessage("All fields must be filled!", "error");
      return false;
    }

    if (isUpdate && !returnDate.trim()) {
      showMessage("Return Date is required for update!", "error");
      return false;
    }

    return true;
  };

  const handleAddBorrow = async (e) => {
    e.preventDefault();
    if (!validateForm(newBorrow, false)) return;

    const bookId = newBorrow.bookForBorrowingRequest.id;

    try {
      // Kitap verisini al
      const book = await BooksService.getBookById(bookId); // BooksService.getBookById ile kitap bilgilerini al

      // Kitap stoğu kontrolü
      if (book.stock <= 0) {
        showMessage(
          "There is no stock of books left, you cannot borrow them.",
          "error"
        );
        return; // Kitap stoğu tükenmişse işlem yapılmaz
      }

      // Kitap stoğu yeterliyse ödünç kaydını ekle
      const addedBorrow = await BorrowService.addBorrow(newBorrow);
      setBorrows([...borrows, addedBorrow]);
      setNewBorrow({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        bookForBorrowingRequest: { id: "" },
      });
      showMessage("Borrowing record added successfully!", "success");
      setShowTable(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      showMessage("An error occurred: ", "error");
    }
  };

  const handleEditClick = (borrow) => {
    setEditingBorrow({
      id: borrow.id,
      borrowerName: borrow.borrowerName,
      borrowerMail: borrow.borrowerMail,
      borrowingDate: borrow.borrowingDate,
      returnDate: borrow.returnDate || "",
      bookForBorrowingRequest: { id: borrow.book?.id || "" },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateBorrow = async (e) => {
    e.preventDefault();
    if (!validateForm(editingBorrow, true)) return;

    try {
      const updatedBorrow = await BorrowService.updateBorrow(editingBorrow.id, {
        borrowerName: editingBorrow.borrowerName,
        borrowingDate: editingBorrow.borrowingDate,
        returnDate: editingBorrow.returnDate,
      });
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

      {/* Tabloyu sadece veriler geldiğinde ve View All veya Add tıklandığında göster */}
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
