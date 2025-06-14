import  { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import InventoryTable from '../components/Inventory/InventoryTable';
import AddItemModal from '../components/Inventory/AddItemModal';
import EditItemModal from '../components/Inventory/EditItemModal';
import DeleteModal from '../components/Inventory/DeleteModal';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import Pagination from '../components/Inventory/Pagination';

const AdminHome = () => {
  const {
    inventory,
    loading,
    error,
    success,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    categoryFilter,
    setCategoryFilter,
    categories,
    pagination,
    handlePageChange,
    calculateStatus,
    setError,
    addItem,
    updateItem,
    deleteItem,
    fetchInventory,
    validCategories
  } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: validCategories[0],
    price: '',
    stock: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async () => {
    setIsProcessing(true);
    const errors = [];
    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.price) errors.push("Price is required");
    if (!formData.stock) errors.push("Stock is required");
    if (!formData.description.trim()) errors.push("Description is required");

    if (errors.length > 0) {
      setError(errors.join(", "));
      setIsProcessing(false);
      return;
    }

    const newItem = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description.trim()
    };

    const added = await addItem(newItem);
    if (added) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        category: validCategories[0],
        price: '',
        stock: '',
        description: ''
      });
    }
    setIsProcessing(false);
  };

  const handleEditItem = async () => {
    setIsProcessing(true);
    const updatedItem = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description
    };

    const updated = await updateItem(currentItem.productId, updatedItem);
    if (updated) {
      setIsEditModalOpen(false);
    }
    setIsProcessing(false);
  };

  const handleDeleteItem = async () => {
    setIsProcessing(true);
    const deleted = await deleteItem(deleteConfirm);
    if (deleted) {
      setDeleteConfirm(null);
    }
    setIsProcessing(false);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      description: item.description
    });
    setIsEditModalOpen(true);
  };

  if (loading && inventory.length === 0) return <Loading />;
  if (error && !success) return <Error error={error} onRetry={fetchInventory} />;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onAddItem={() => setIsAddModalOpen(true)} 
        />
        
        <main className="p-6">
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md cursor-default">
              {success}
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600 cursor-default">Filter by:</div>
              <select 
                className="border border-gray-300 rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category} className="cursor-pointer">{category}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 cursor-default">
              Showing {inventory.length} of {pagination.totalItems} items (Page {pagination.page} of {pagination.totalPages})
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <InventoryTable 
              inventory={inventory}
              calculateStatus={calculateStatus}
              requestSort={requestSort}
              sortConfig={sortConfig}
              openEditModal={openEditModal}
              setDeleteConfirm={setDeleteConfirm}
            />
            
            <Pagination 
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      <AddItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAddItem={handleAddItem}
        error={error}
        validCategories={validCategories}
        isProcessing={isProcessing}
      />
      
      <EditItemModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleEditItem={handleEditItem}
        error={error}
        validCategories={validCategories}
        isProcessing={isProcessing}
      />
      
      <DeleteModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteItem}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AdminHome;