import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from "../../api/axios";
import ConfirmationModal from './modal/ConfirmationModal.jsx';

const GenreManagement = () => {
  const [genre, setGenre] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const fields = ['gen_id', 'genre_name', 'description'];

  useEffect(() => {
    fetchGenre();
  }, []);

  const fetchGenre = async () => {
    try {
      const response = await api.get('/api/books/genres');
      console.log('response:', response.data);
      setGenre(response.data);
    } catch (error) {
      console.error('Error fetching genre:', error);
    }
  };
  const openConfirmModal = (id) => {
    setGenreToDelete(id);
    setShowConfirmModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the name is already taken
    console.log('formData:', formData);
    const isNameTaken = genre.some(genre => genre.genre_name.toLowerCase() === formData.genre_name.toLowerCase());
    if (isNameTaken && !currentGenre) {
      setError('The genre name is already taken.');
      return;
    }
    const isIDTaken = genre.some(genre => genre.gen_id === formData.gen_id);
    if (isIDTaken&& !currentGenre) {
      setError('The genre id is already taken.');
      return;
    }
    try {
      const method = currentGenre ? 'PUT' : 'POST';
      const url = currentGenre ? `/api/books/genre/${currentGenre.gen_id}` : '/api/books/genre';
      if (method === 'PUT') {
        await api.put(url, formData);
      } else {
        await api.post(url, formData);
      }
      setShowModal(false);
      fetchGenre();
      setFormData({});
      setError('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while saving the genre.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/books/genre/${genreToDelete}`);
      fetchGenre();
      setShowConfirmModal(false);
      setGenreToDelete(null);
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const handleEdit = (genre) => {
    console.log("HANDLE EDIT GENRE: ", genre);
    setCurrentGenre(genre);
    setFormData(genre);
    setShowModal(true);
  };

  // Filter genre based on general search and gen_id search
  const filteredGenre = genre.filter((genre) => {
    if (selectedSearchField === 'general') {
      return genre.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'gen_id') {
      return genre.gen_id.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'genre_name') {
      return genre.genre_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedSearchField === 'description') {
      return genre.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Genre Management</h2>
          <div className="flex items-center space-x-2">
          {/* Search Dropdown */}
            <select
              value={selectedSearchField}
              onChange={(e) => setSelectedSearchField(e.target.value)}
              className="border px-4 py-2 rounded-md"
            >
              <option value="general">Search General</option>
              <option value="gen_id">Search by ID</option>
              <option value="genre_name">Search by Name</option>
              <option value="description">Search by Description</option>
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
                setCurrentGenre(null); 
                setShowModal(true);
              }}
            >
              <Plus className="mr-2" />
              Add genre
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Genre ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenre.map((genre) => (
                <tr key={genre.gen_id}>
                  <td className="px-4 py-2 text-left">{genre.gen_id}</td>
                  <td className="px-4 py-2 text-left">{genre.genre_name}</td>
                  <td className="px-4 py-2 text-left">{genre.description}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => handleEdit(genre)} className="text-blue-500">
                      <Pencil size={18} />
                    </button>
                    <button  onClick={() => openConfirmModal(genre.gen_id)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit genre */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">{currentGenre ? 'Edit Genre' : 'Add New Genre'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Set default value for gen_id */}
                <div>
                {currentGenre && (
                  <div>
                    <label className="block text-sm font-medium">Genre ID</label>
                    <input
                      type="number"
                      name="gen_id"
                      value={formData.gen_id || ''}  // Default value if available
                      disabled={true}  // Disable the input field in edit mode
                      className="w-full border px-4 py-2 rounded-md"
                    />
                  </div>
                )}
                </div>
                {fields.map(field => (
                  field === 'genre_name' && (  // Skip rendering the gen_id input
                    <div key={field}>
                      <label className="block text-sm font-medium">{(field.charAt(0).toUpperCase() + field.slice(1)).replace('_', ' ')}</label>
                      <input
                        type={'text'}
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
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    {currentGenre ? 'Update Genre' : 'Add Genre'}
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
        message="Are you sure you want to delete this Genre?"
      />
    </div>
  );
};

export default GenreManagement;
