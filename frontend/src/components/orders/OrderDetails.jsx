import { formatDate, formatCurrency } from './utils';
import { toast } from 'react-toastify';

const OrderDetails = ({ order }) => {
  const getProductName = (product) => {
    return product?.name || 
           product?.title || 
           product?.productName || 
           product?.productDetails?.name || 
           'Unknown Product';
  };

  const getProductPrice = (product) => {
    return product?.price || 
           product?.unitPrice || 
           product?.productDetails?.price || 
           0;
  };

  const calculateOrderTotal = () => {
    // Try different possible total fields
    if (order.total !== undefined && order.total !== null) return order.total;
    if (order.amount !== undefined && order.amount !== null) return order.amount;
    
    // Calculate from products if no total exists
    if (order.products) {
      return order.products.reduce((sum, item) => {
        const product = item.productDetails || item;
        return sum + (item.quantity * getProductPrice(product));
      }, 0);
    }
    
    return 0; 
  };

  return (
    <div className="text-sm bg-white rounded border p-3 max-w-xs">
      {/* Header with status */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Order #{order.orderId?.slice(-4) || order._id?.slice(-4)}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>

      {/* Mini timeline */}
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <span>Placed: {formatDate(order.createdAt, 'short')}</span>
        {order.status === 'delivered' && (
          <span>Delivered: {formatDate(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 4), 'short')}</span>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
        {order.products?.slice(0, 3).map((item, index) => {
          const product = item.productDetails || item;
          return (
            <div key={index} className="flex justify-between text-xs">
              <span className="truncate pr-2">{getProductName(product)}</span>
              <span className="whitespace-nowrap">{item.quantity} × {formatCurrency(getProductPrice(product))}</span>
            </div>
          );
        })}
        {order.products?.length > 3 && (
          <div className="text-xs text-gray-500">+{order.products.length - 3} more items</div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t pt-2">
        <div className="flex justify-between text-xs font-medium">
          <span>Total:</span>
          <span>{formatCurrency(calculateOrderTotal())}</span>
        </div>
      </div>

      {/* Mini actions */}
      <div className="flex justify-end gap-1 mt-2">
        <button 
          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded"
          onClick={() => toast.info('Print coming soon')}
        >
          Print
        </button>
        <button 
          className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded"
          onClick={() => toast.info('Track coming soon')}
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
