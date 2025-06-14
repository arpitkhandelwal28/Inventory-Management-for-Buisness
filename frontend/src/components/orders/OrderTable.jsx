import React from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import OrderDetails from './OrderDetails';
import { formatDate, formatCurrency } from './utils';

const OrderTable = ({
  orders,
  sortConfig,
  requestSort,
  expandedOrderId,
  toggleOrderDetails,
  setSelectedOrder,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setOrderToDelete
}) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('_id')}
            >
              <div className="flex items-center">
                Order ID
                {sortConfig.key === '_id' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('user.email')}
            >
              <div className="flex items-center">
                Customer Email
                {sortConfig.key === 'user.email' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('createdAt')}
            >
              <div className="flex items-center">
                Date
                {sortConfig.key === 'createdAt' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('products.length')}
            >
              <div className="flex items-center">
                Items
                {sortConfig.key === 'products.length' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('totalPrice')}
            >
              <div className="flex items-center">
                Total
                {sortConfig.key === 'totalPrice' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('status')}
            >
              <div className="flex items-center">
                Status
                {sortConfig.key === 'status' && (
                  sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr className={`hover:bg-gray-50 ${expandedOrderId === order._id ? 'bg-gray-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    aria-label="View details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user?.email || 'No email'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.products?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      aria-label="Edit order"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setOrderToDelete(order);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      aria-label="Delete order"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 bg-gray-50 border-b">
                    <OrderDetails order={order} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;