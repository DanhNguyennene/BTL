import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from "../../api/axios";
import ConfirmationModal from './modal/ConfirmationModal.jsx';

const AuthorManagement = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const fields = ['author_id', 'name', 'dob'];

  useEffect(() => {
    fetchAuthors();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const day = d.getDate();
    const year = d.getFullYear();
  
    // Pad the month and day with leading zeros if needed
    const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    return formattedDate;
  };
  const fetchAuthors = async () => {
    try {
      const response = await api.get('/api/books/authors');
      (response.data).map(data=>{
        data.dob = new Date(data.dob).toISOString().split('T')[0];
      })
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };
  const openConfirmModal = (id) => {
    setAuthorToDelete(id);
    setShowConfirmModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the name is already taken
    const isNameTaken = authors.some(author => author.name.toLowerCase() === formData.name.toLowerCase());
    if (isNameTaken && !currentAuthor) {
      setError('The author name is already taken.');
      return;
    }
    const isIDTaken = authors.some(author => author.author_id === formData.author_id);
    if (isIDTaken&& !currentAuthor) {
      setError('The author id is already taken.');
      return;
    }
    try {
      const method = currentAuthor ? 'PUT' : 'POST';
      const url = currentAuthor ? `/api/books/author/${currentAuthor.author_id}` : '/api/books/author';
      
      if (method === 'PUT') {
        await api.put(url, formData);
      } else {
        await api.post(url, formData);
      }
      setShowModal(false);
      fetchAuthors();
      setFormData({});
      setError('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while saving the author.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/books/author/${authorToDelete}`);
      fetchAuthors();
      setShowConfirmModal(false);
      setAuthorToDelete(null);
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const handleEdit = (author) => {
    setCurrentAuthor(author);
    setFormData(author);
    setShowModal(true);
  };

  // Filter authors based on general search and author_id search
  const filteredAuthors = authors.filter((author) => {
    if (selectedSearchField === 'general') {
      return author.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'author_id') {
      return author.author_id.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'name') {
      return author.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedSearchField === 'dob') {
      // Format the date to compare (e.g., MM/DD/YYYY format)
      const formattedDob = new Date(author.dob).toLocaleDateString();
      return formattedDob.includes(searchTerm);
    }
    if (selectedSearchField === 'biography') {
      return author.biography.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Author Management</h2>
          <div className="flex items-center space-x-2">
          {/* Search Dropdown */}
            <select
              value={selectedSearchField}
              onChange={(e) => setSelectedSearchField(e.target.value)}
              className="border px-4 py-2 rounded-md"
            >
              <option value="general">Search General</option>
              <option value="author_id">Search by ID</option>
              <option value="name">Search by Name</option>
              <option value="dob">Search by Date of Birth</option>
              <option value="biography">Search by Biography</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded-md"
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-md flex items-center"
              onClick={() => {
                setFormData({});
                setCurrentAuthor(null); 
                setShowModal(true);
              }}
            >
              <Plus className="mr-2" />
              Add Author
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Author ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">
                  Date of Birth
                  <div className="text-xs text-gray-500 opacity-70">MM/DD/YYYY</div> {/* Add the format label below */}
                </th>
                <th className="px-4 py-2 text-left">Biography</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map((author) => (
                <tr key={author.author_id}>
                  <td className="px-4 py-2 text-left">{author.author_id}</td>
                  <td className="px-4 py-2 text-left">{author.name}</td>
                  <td className="px-4 py-2 text-left">{formatDate(author.dob)}</td>
                  <td className="px-4 py-2 text-left">{author.biography}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => handleEdit(author)} className="text-blue-500">
                      <Pencil size={18} />
                    </button>
                    <button  onClick={() => openConfirmModal(author.author_id)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Author */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">{currentAuthor ? 'Edit Author' : 'Add New Author'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Set default value for author_id */}
                <div>
                {currentAuthor && (
                  <div>
                    <label className="block text-sm font-medium">Author ID</label>
                    <input
                      type="number"
                      name="author_id"
                      value={formData.author_id || ''}  // Default value if available
                      disabled={true}  // Disable the input field in edit mode
                      className="w-full border px-4 py-2 rounded-md"
                    />
                  </div>
                )}
                </div>
                {fields.map(field => (
                  field !== 'author_id' && (  // Skip rendering the author_id input
                    <div key={field}>
                      <label className="block text-sm font-medium">{(field.charAt(0).toUpperCase() + field.slice(1)).replace('_', ' ')}</label>
                      <input
                        type={field === 'dob' ? 'date' : 'text'}
                        name={field}
                        value={formData[field] || ''}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                      />
                    </div>
                  )
                ))}
                <div>
                  <label className="block text-sm font-medium">Biography</label>
                  <textarea
                    name="biography"
                    value={formData.biography || ''}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="w-full border px-4 py-2 rounded-md h-32"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-black p-2 rounded-md"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    {currentAuthor ? 'Update Author' : 'Add Author'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmModal(false)}
        message="Are you sure you want to delete this author?"
      />
    </div>
  );
};

export default AuthorManagement;
