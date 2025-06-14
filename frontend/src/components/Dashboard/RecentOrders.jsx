import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const RecentOrders = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort orders by date (newest first) and limit to 3
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <ShoppingCart className="text-blue-500 mr-2" size={20} />
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
          {orders.length} orders
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {latestOrders.map(order => (
          <div key={order._id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-900">Order ID: {order._id.slice(-6).toUpperCase()}</div>
                <div className="text-sm text-gray-500">{order?.user?.name || 'Guest User'}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${order?.totalPrice?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
        <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Orders →
        </Link>
      </div>
    </div>
  );
};

export default RecentOrders;



