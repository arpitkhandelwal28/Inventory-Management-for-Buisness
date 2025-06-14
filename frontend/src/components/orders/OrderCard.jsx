import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatCurrency } from './utils';

const OrderCard = ({ order, onToggleExpand, onEdit, onCancel }) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow cursor-pointer" 
      onClick={onToggleExpand}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{order._id}</p>
          <p className="text-sm">{order.user?.name || 'Unknown Customer'}</p>
          <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-2 text-sm text-gray-600 flex justify-between">
        <span>{formatDate(order.createdAt)}</span>
        <span>{formatCurrency(order.totalPrice)}</span>
      </div>
      <div className="mt-2 text-sm flex justify-between items-center">
        <span><b>Items:</b> {order.products?.length || 0}</span>
      </div>
      <div className="mt-3 flex justify-between">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-blue-600 flex items-center cursor-pointer"
        >
          <Eye size={16} className="mr-1" /> View Details
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="text-red-600 hover:text-red-900 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OrderCard;