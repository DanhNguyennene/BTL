import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from "../../api/axios";
import ConfirmationModal from './modal/ConfirmationModal.jsx';

const PublisherManagement = () => {
  const [publishers, setPublishers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState(null);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const fields = ['pu_id', 'pu_name', 'pu_phone_number'];

  useEffect(() => {
    fetchPublishers();
  }, []);


  const fetchPublishers = async () => {
    try {
      const response = await api.get('/api/books/publishers');
      setPublishers(response.data);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    }
  };
  const openConfirmModal = (id) => {
    setPublisherToDelete(id);
    setShowConfirmModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the name is already taken
    const isNameTaken = publishers.some(publisher => publisher.pu_name.toLowerCase() === formData.pu_name.toLowerCase());
    if (isNameTaken && !currentPublisher) {
      setError('The publisher name is already taken.');
      return;
    }
    const isIDTaken = publishers.some(publisher => publisher.pu_id === formData.pu_id);
    if (isIDTaken&& !currentPublisher) {
      setError('The Publisher id is already taken.');
      return;
    }
    try {
      const method = currentPublisher ? 'PUT' : 'POST';
      const url = currentPublisher ? `/api/books/publisher/${currentPublisher.pu_id}` : '/api/books/publisher';
      if (method === 'PUT') {
        await api.put(url, formData);
      } else {
        await api.post(url, formData);
      }
      setShowModal(false);
      fetchPublishers();
      setFormData({});
      setError('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while saving the publisher.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/books/publisher/${publisherToDelete}`);
      fetchPublishers();
      setShowConfirmModal(false);
      setPublisherToDelete(null);
    } catch (error) {
      console.error('Error deleting publisher:', error);
    }
  };

  const handleEdit = (publisher) => {
    setCurrentPublisher(publisher);
    setFormData(publisher);
    setShowModal(true);
  };

  // Filter publishers based on general search and pu_id search
  const filteredpublishers = publishers.filter((publisher) => {
    if (selectedSearchField === 'general') {
      return publisher.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'pu_id') {
      return publisher.pu_id.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'pu_name') {
      return publisher.pu_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedSearchField === 'pu_phone_number') {
      return publisher.pu_phone_number.toString().includes(searchTerm);
    }
    if (selectedSearchField === 'pu_address') {
      return publisher.pu_address.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Publisher Management</h2>
          <div className="flex items-center space-x-2">
          {/* Search Dropdown */}
            <select
              value={selectedSearchField}
              onChange={(e) => setSelectedSearchField(e.target.value)}
              className="border px-4 py-2 rounded-md"
            >
              <option value="general">Search General</option>
              <option value="pu_id">Search by ID</option>
              <option value="pu_name">Search by Name</option>
              <option value="pu_phone_number">Search by Phone Number</option>
              <option value="pu_address">Search by Publisher Address</option>
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
                setCurrentPublisher(null); 
                setShowModal(true);
              }}
            >
              <Plus className="mr-2" />
              Add publisher
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Publisher ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Publisher Address</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredpublishers.map((publisher) => (
                <tr key={publisher.pu_id}>
                  <td className="px-4 py-2 text-left">{publisher.pu_id}</td>
                  <td className="px-4 py-2 text-left">{publisher.pu_name}</td>
                  <td className="px-4 py-2 text-left">{publisher.pu_phone_number}</td>
                  <td className="px-4 py-2 text-left">{publisher.pu_address}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => handleEdit(publisher)} className="text-blue-500">
                      <Pencil size={18} />
                    </button>
                    <button  onClick={() => openConfirmModal(publisher.pu_id)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit publisher */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">{currentPublisher ? 'Edit publisher' : 'Add New publisher'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Set default value for pu_id */}
                <div>
                {currentPublisher && (
                  <div>
                    <label className="block text-sm font-medium">Publisher ID</label>
                    <input
                      type="number"
                      name="pu_id"
                      value={formData.pu_id || ''}  // Default value if available
                      disabled={true}  // Disable the input field in edit mode
                      className="w-full border px-4 py-2 rounded-md"
                    />
                  </div>
                )}
                </div>
                {fields.map(field => (
                  field !== 'pu_id' && (  // Skip rendering the pu_id input
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
                  <label className="block text-sm font-medium">pu_address</label>
                  <textarea
                    name="pu_address"
                    value={formData.pu_address || ''}
                    onChange={(e) => setFormData({ ...formData, pu_address: e.target.value })}
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
                    {currentPublisher ? 'Update publisher' : 'Add publisher'}
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
        message="Are you sure you want to delete this publisher?"
      />
    </div>
  );
};

export default PublisherManagement;
