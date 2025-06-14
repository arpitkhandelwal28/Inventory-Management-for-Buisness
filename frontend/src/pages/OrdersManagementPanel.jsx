import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Layout/Sidebar';
import OrderFilters from '../components/orders/OrderFilters';
import OrderCard from '../components/orders/OrderCard';
import OrderTable from '../components/orders/OrderTable';
import StatusModal from '../components/orders/StatusModal';
import Pagination from '../components/Inventory/Pagination';
import { getSortedOrders } from '../components/orders/utils';
import axios from 'axios';

const OrdersManagementPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending',
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed items per page

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders', {
        withCredentials: true,
      });
      setOrders(response.data);
      setError(null);
      setCurrentPage(1);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    let message = 'An unknown error occurred';
    if (error.response) {
      message =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    } else if (error.request) {
      message = 'No response from server - please check your connection';
    } else {
      message = error.message;
    }
    setError(message);
    toast.error(message);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const cancelOrder = async (orderId) => {
    if (!orderId) {
      toast.error('Invalid order ID');
      return;
    }
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.put(
          `http://localhost:5000/api/orders/${orderId}/status`,
          { status: 'cancelled' },
          { withCredentials: true }
        );
        fetchOrders();
        toast.success('Order cancelled successfully');
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedOrder || !selectedOrder._id || !status) {
      toast.error('Please select a valid order and status');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/status`,
        { status },
        { withCredentials: true }
      );
      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id ? response.data : order
        )
      );
      toast.success(`Order status updated to ${status}`);
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sort, Filter, and Paginate
  const sortedOrders = getSortedOrders(
    orders,
    searchQuery,
    statusFilter,
    sortConfig
  );

  const totalItems = sortedOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, totalItems);
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const pagination = {
    page: currentPage,
    limit: itemsPerPage,
    totalItems,
    totalPages,
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-3 sm:px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Orders Management
          </h2>
        </header>

        <main className="p-3 sm:p-6">
          <OrderFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            fetchOrders={fetchOrders}
            sortedOrdersCount={sortedOrders.length}
            totalOrdersCount={orders.length}
          />

          {loading && (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <p className="mt-2">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              <p className="font-medium">Error loading orders:</p>
              <p>{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="block md:hidden space-y-4">
                {currentItems.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    expanded={expandedOrderId === order._id}
                    onToggleExpand={() => toggleOrderDetails(order._id)}
                    onEdit={() => {
                      setSelectedOrder(order);
                      setIsEditModalOpen(true);
                    }}
                    onCancel={() => cancelOrder(order._id)}
                  />
                ))}
              </div>

              <div className="hidden md:block">
                <OrderTable
                  orders={currentItems}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  expandedOrderId={expandedOrderId}
                  toggleOrderDetails={toggleOrderDetails}
                  setSelectedOrder={setSelectedOrder}
                  setIsEditModalOpen={setIsEditModalOpen}
                  cancelOrder={cancelOrder}
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} results
                </div>

                <Pagination
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </main>
      </div>

      <StatusModal
        isOpen={isEditModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrdersManagementPanel;

