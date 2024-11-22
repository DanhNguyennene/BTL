import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";



const GenreSelector = ({ formData, setFormData, genres }) =>{
  const [showDropdown, setShowDropdown] = useState('');
  const handleGenreSelect = (genreId, genreName) => {
    if (!formData.genre_ids.includes(genreId)) {
      setFormData(prev => ({
        ...prev,
        genre_ids: [...prev.genre_ids, genreId]
      }));
    }
    setShowDropdown(false);
  };

  const removeGenre = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genre_ids: prev.genre_ids.filter(id => id !== genreId)
    }));
  };

  return (
    <div className="relative">
      <label className="block text-lg font-medium text-gray-700 mb-3 mt-5">Genres</label>
      <div className="min-h-[42px] p-2 border rounded-md flex flex-wrap gap-2 mb-2">
        {formData.genre_ids.map(genreId => {
          const genre = genres.find(g => g.gen_id === genreId);
          return (
            <span 
              key={genreId}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
            >
              {genre?.genre_name}
              <button
                type="button"
                onClick={() => removeGenre(genreId)}
                className="hover:text-red-500"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-50"
        >
          Add Genre
        </button>
        
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {genres
              .filter(genre => !formData.genre_ids.includes(genre.gen_id))
              .map(genre => (
                <button
                  key={genre.gen_id}
                  type="button"
                  onClick={() => handleGenreSelect(genre.gen_id, genre.genre_name)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {genre.genre_name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


const Modal = ({ 
  showModal, 
  setShowModal, 
  formData, 
  setFormData,
  handleInputChange, 
  isEditing, 
  handleSubmit, 
  authors, 
  publishers, 
  genres
}) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${showModal ? '' : 'hidden'}`}>
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">

      <h2 className="text-2xl font-bold mb-4 text-center">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">Title</label>
          <div className="relative">
            <input
              type="text"
              name="title"  
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleInputChange}
              className={`appearance-none rounded-md block w-full px-4 py-3 border ${formData.title ? 'border-green-500' : 'border-gray-300'}
              placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-base leading-tight shadow-sm hover:shadow-md focus:shadow-lg`}
              autoComplete="off"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {formData.title && (
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 mt-5">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <GenreSelector 
              formData={formData}
              setFormData={setFormData}
              genres={genres}
            />
          
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 mt-5">Author</label>
            <select
              name='author_id'
              value={formData.author_id}
              onChange={handleInputChange}
              className={`appearance-none rounded-md block w-full px-4 py-3 border ${
                formData.author_id ? 'border-green-500' : 'border-gray-300'
              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-base leading-tight shadow-sm hover:shadow-md focus:shadow-lg`}
              required
            >
              <option value="">Select Author</option>
              {authors.map(author => (
                <option key={author.author_id} value={author.author_id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 mt-5">Publishers</label>

            <select
              name='pu_id'
              value={formData.pu_id}
              onChange={handleInputChange}
              className={`appearance-none rounded-md block w-full px-4 py-3 border ${
                formData.pu_id ? 'border-green-500' : 'border-gray-300'
              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-base leading-tight shadow-sm hover:shadow-md focus:shadow-lg`}
              required
            >
              <option value="">Select Publisher</option>
              {publishers.map(publisher => (
                <option key={publisher.pu_id} value={publisher.pu_id}>
                  {publisher.pu_name}
                </option>
              ))}
            </select>

          
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 mt-5">Image URL</label>
            <input
              type="url"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className={`appearance-none rounded-md block w-full px-4 py-3 border ${
                formData.imageURL ? "border-green-500" : "border-gray-300"
              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-base leading-tight shadow-sm hover:shadow-md focus:shadow-lg`}
              autoComplete="off"
              required
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <button
              type='button'
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 "
            >
              Cancel
            </button>

            <button
              type='submit'
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing? "Update book": "Create new book"}
            </button>
          </div>

        </div>
      </form>
    </div>
  </div>
);


const SearchAndFiltersSection = ({
  searchQuery,
  setSearchQuery,
  handleSearchChange,
  handleFilterChange,
  getFilteredBooks
}) => (
  <div className="mb-6 space-y-4">
    <h3 className="bg-white p-4 rounded-lg shadow ">Search</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div>
        <label>Title</label>
        <input
          placeholder="Search by title"
        />
      </div>

      <div>
        <label>Author</label>
        <input
          placeholder="Search by title"
        />
      </div>

      <div>
        <label>Publisher</label>
        <input
          placeholder="Search by title"
        />
      </div>


    </div>
  </div>
)

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  const [searchQuery, setSearchQuery] = useState({
    title:'',
    author: '',
    publisher: ''
  })
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    selectedGenre: '',
    selectedAuthor: '',
    selectedPublisher: ''
  })
  const handleSearchChange = (e) => {
    const {name, value} = e.target;
    setSearchQuery(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const {name, value} = e.target;
    setFilters(prev => ({
      ...prev, 
      [name]: value
    }))
  }

  const getFilteredBooks  = () => {
    return books.filter( book => {
      // search filter
      const titleMatch = book.title.toLowerCase().includes(searchQuery.title.toLowerCase());
      const authorMatch = authors.find(a => a.author_id === book.author_id)?.name
      .toLowerCase().includes(searchQuery.author.toLowerCase());

      const publisherMatch = publishers.find(p => p.pu_id === book.pu_id)?.pu_name.toLowerCase().includes(searchQuery.publisher.toLowerCase())

      // range and selection filters
      const priceInRange = (!filters.priceMin  || book.price  >= Number(filters.priceMin)) && (!filters.priceMax || book.price <= Number(filters.priceMax))
      const genreMatch = !filters.selectedGenre || book.genreID.split(',').includes(filters.selectedGenre)
      const authorFilter = !filters.selectedAuthor || book.author_id === Number(filters.selectedAuthor)
      const publisherFilter = !filters.selectedPublisher || book.pu_id === Number(filters.selectedAuthor)
      return titleMatch && authorMatch && publisherMatch && priceInRange && genreMatch && authorFilter && publisherFilter
    });
  };
  

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    genre_ids: [],
    author_id: "",
    pu_id: "",
    imageURL: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, authorRes, genreRes] = await Promise.all([
        api.get("/api/books"),
        api.get("/api/books/authors"),
        api.get("/api/books/genres")
      ]);
      const publishersRes = await api.get("/api/books/publishers");
      setBooks(bookRes.data);
      setAuthors(authorRes.data);
      setGenres(genreRes.data);
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
    
    switch(name) {
      case 'price':
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
          setFormData(prev => ({
            ...prev,
            [name]: value ? parseFloat(value, 10) : ''
          }));
        }
        break;
  
      case 'author_id':
      case 'pu_id':
      case 'genre_ids':
        setFormData(prev => ({
          ...prev,
          [name]: value ? parseInt(value, 10) : ''
        }));
        break;
  
      default:
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };

  const validateForm = () => {
    const { title, price, genre_ids, author_id, pu_id, imageURL } = formData; 
    if (!title || !price || !author_id || !pu_id || !imageURL || !genre_ids){ 
      toast.error("All fields are required");
      return false;
    }
    if (parseFloat(price) <= 0) { 
      toast.error("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      genre_ids: [],
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
        const {book_id, ...updateData} = formData
        console.log(updateData)
        const response = await api.patch(`/api/books/${book_id}`, updateData);
        console.log("Edit response:", response);
        toast.success("Book updated successfully");
      } else {
        const response = await api.post("/api/books", formData);
        console.log("Create response:", response);
        toast.success("Book created successfully");
      }
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")){
      console.log(bookId)
      try{
        await api.delete(`/api/books/${bookId.book_id}`)
        toast.success("Book deleted successfully");
        fetchData(); // refresh the book list
      }catch(error){
        toast.error(error.response?.data?.message || "Error deleting book");
        console.error("Delete error:", error);
      }
    }
  }

  const handleEdit = (book) => {

    const genreIds  = book.genreID.split(',').map(num => parseInt(num,10))
    console.log(genreIds)
    setFormData({
      book_id: book.book_id,
      title: book.title,
      price: book.price,
      genre_ids: genreIds,
      author_id: book.author_id,
      pu_id: book.pu_id,
      imageURL: book.imageURL
    });
    setIsEditing(true);
    setShowModal(true);
  };

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
      {/* <SearchAndFiltersSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        getFilteredBooks={getFilteredBooks}
      
      /> */}
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
                  Price Per Book 
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity 
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
                  <td className="px-4 py-2 whitespace-nowrap">{book.quantity}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {book.genreName?.split(',').map((genre, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded-full mr-2 mb-2">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{
                      authors.find(a => a.author_id === book.author_id)?.name || "Unknown"
                    }</td>

                  <td className="px-4 py-2 whitespace-nowrap">
                      {publishers.find(a => a.pu_id === book.pu_id)?.pu_name || "Unknown"}
                    </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >

                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(book)}
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

      
      <Modal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        formData={formData} 
        setFormData={setFormData}
        handleInputChange={handleInputChange} 
        isEditing={isEditing} 
        handleSubmit={handleSubmit} 
        authors={authors}
        publishers={publishers}
        genres={genres}
      />

        
    </div>
  );
};

export default BookManagement;





