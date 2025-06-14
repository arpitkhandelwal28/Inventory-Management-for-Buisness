import { Search, Download, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify'; 

const OrderFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  fetchOrders,
  sortedOrdersCount,
  totalOrdersCount
}) => {
  const statuses = ['All', 'pending', 'processed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          title="Refresh orders"
        >
          <RefreshCw size={18} />
        </button>
        <button 
          className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer"
          onClick={() => toast.info('Export functionality coming soon')}
        >
          <Download size={18} className="mr-1" /> Export
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-600">Filter by status:</div>
        <select 
          className="border border-gray-300 rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <div className="text-sm text-gray-600">
          Showing {sortedOrdersCount} of {totalOrdersCount} orders
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;