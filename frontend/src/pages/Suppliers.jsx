import { useState } from 'react';
import { 
  Search, Phone, Mail, Plus, Edit, Trash2, ChevronDown, X 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Layout/Sidebar';

const SuppliersPanel = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Tech Supplies Inc.', contact: 'John Smith', email: 'john@techsupplies.com', phone: '(555) 123-4567', category: 'Electronics', status: 'Active' },
    { id: 2, name: 'Office Depot', contact: 'Sarah Johnson', email: 'sarah@officedepot.com', phone: '(555) 987-6543', category: 'Office Supplies', status: 'Active' },
    { id: 3, name: 'GlobalParts Co.', contact: 'Mike Chen', email: 'mike@globalparts.com', phone: '(555) 456-7890', category: 'Hardware', status: 'Inactive' },
    { id: 4, name: 'EcoPackaging', contact: 'Lisa Wong', email: 'lisa@ecopackaging.com', phone: '(555) 234-5678', category: 'Packaging', status: 'Active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    category: '',
    status: 'Active'
  });

  const categories = ['Electronics', 'Office Supplies', 'Hardware', 'Packaging', 'Food', 'Textiles'];

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (supplierId) => {
    navigate(`/suppliers/${supplierId}`);
  };

  const handleContactSupplier = (supplier) => {
    console.log(`Contacting ${supplier.name}`);
  };

  const openAddSupplierModal = () => {
    setIsEditMode(false);
    setCurrentSupplier({
      id: '',
      name: '',
      contact: '',
      email: '',
      phone: '',
      category: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const openEditSupplierModal = (supplier) => {
    setIsEditMode(true);
    setCurrentSupplier({ ...supplier });
    setIsAddModalOpen(true);
  };

  const openDeleteConfirmation = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === currentSupplier.id ? currentSupplier : supplier
        )
      );
    } else {
      const newSupplier = {
        ...currentSupplier,
        id: Math.max(...suppliers.map(s => s.id), 0) + 1
      };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    
    setIsAddModalOpen(false);
  };

  const handleDelete = () => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierToDelete.id));
    setIsDeleteModalOpen(false);
    setSupplierToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-200 text-green-900';
      case 'Inactive':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Use the imported Sidebar component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Suppliers</h2>
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" size={18} />
                <input 
                  type="text" 
                  placeholder="Search suppliers..." 
                  className="pl-10 pr-4 py-2 rounded-4xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="ml-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex items-center"
                onClick={openAddSupplierModal}
              >
                <Plus size={18} className="mr-1 cursor-pointer" />
                Add Supplier
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No suppliers found. Try a different search or add a new supplier.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.category}</p>
                    </div>
                    <span className={`${getStatusColor(supplier.status)} text-xs px-2 py-1 rounded-xl cursor-default`}>
                      {supplier.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">{supplier.contact}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                      <Mail size={16} className="mr-1" />
                      <a href={`mailto:${supplier.email}`} className="cursor-pointer">{supplier.email}</a>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                      <Phone size={16} className="mr-1" />
                      <a href={`tel:${supplier.phone.replace(/\D/g, '')}`} className="cursor-pointer">{supplier.phone}</a>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 font-medium text-sm cursor-pointer transition-colors duration-200"
                      onClick={() => handleViewDetails(supplier.id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 font-medium text-sm cursor-pointer transition-colors duration-200"
                      onClick={() => handleContactSupplier(supplier)}
                    >
                      Contact
                    </button>
                    <button 
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium text-sm cursor-pointer transition-colors duration-200"
                      onClick={() => openEditSupplierModal(supplier)}
                    >
                      <Edit size={16} className="cursor-pointer" />
                    </button>
                    <button 
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium text-sm cursor-pointer transition-colors duration-200"
                      onClick={() => openDeleteConfirmation(supplier)}
                    >
                      <Trash2 size={16} className="cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-default">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentSupplier.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Contact Person</label>
                  <input
                    type="text"
                    name="contact"
                    value={currentSupplier.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={currentSupplier.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={currentSupplier.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Category</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={currentSupplier.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" size={16} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">Status</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={currentSupplier.status === 'Active'}
                        onChange={handleInputChange}
                        className="text-gray-700 cursor-pointer"
                      />
                      <span className="ml-2">Active</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={currentSupplier.status === 'Inactive'}
                        onChange={handleInputChange}
                        className="text-gray-700 cursor-pointer"
                      />
                      <span className="ml-2">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
                >
                  {isEditMode ? 'Update Supplier' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-default">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-6 cursor-default">
              Are you sure you want to delete <span className="font-semibold">{supplierToDelete?.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                Delete Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPanel;