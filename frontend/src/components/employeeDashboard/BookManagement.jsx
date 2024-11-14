import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    book_id: "",
    title: "",
    price: "",
    author_id: "",
    pu_id: "",
    imageURL: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, authorRes] = await Promise.all([
        api.get("/api/books"),
        api.get("/api/books/authors"),
      ]);
      const publishersRes = await api.get("/api/books/publishers");
      setBooks(bookRes.data);
      setAuthors(authorRes.data);
      setPublishers(publishersRes.data);
    } catch (error) {
      toast.error("Error fetching data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const validateForm = () => {
    const { title, price, author_id, pu_id, imageURL } = formData;
    if (!title || !price || !author_id || !pu_id || !imageURL) {
      toast.error("All fields are required");
      return false;
    }
    if (price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      book_id: "",
      title: "",
      price: "",
      author_id: "",
      pu_id: "",
      imageURL: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (isEditing) {
        await api.patch(`/api/books/${formData.book_id}`, formData);
        toast.success("Book updated successfully");
      } else {
        await api.post("/api/books", formData);
        toast.success("Book created successfully");
      }
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };


  

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/api/books/${bookId}`);
        toast.success("Book deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting books");
      }
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Book Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Book
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publisher
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                
                <tr key={book.book_id} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={book.imageURL}
                      alt={book.title}
                      className="h-16 w-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{book.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${book.price}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{book.genreName}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{
                      authors.find(a => a.author_id === book.author_id)?.name || "Unknown"
                    }</td>

                  <td className="px-4 py-2 whitespace-nowrap">
                      {publishers.find(a => a.pu_id === book.pu_id)?.pu_name || "Unknown"}
                    </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => console.log("Hello")}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >

                      Edit
                    </button>

                    <button
                      onClick={() => console.log("Hello")}
                      className="text-red-500 hover:text-red-700"
                    > 
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {showModal && <Modal/>} */}
    </div>
  );
};

export default BookManagement;
