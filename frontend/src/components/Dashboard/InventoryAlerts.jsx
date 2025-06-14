import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const InventoryAlerts = ({ items, calculateStatus }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center">
      <AlertTriangle className="text-red-500 mr-2" size={20} />
      <h3 className="font-semibold text-gray-800">Critical Inventory</h3>
      <span className="ml-auto bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
        {items.length} alerts
      </span>
    </div>
    
    <div className="divide-y divide-gray-200">
      {items.slice(0, 5).map(item => {
        const { status, color } = calculateStatus(item.stock);
        return (
          <div key={item.productId} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
                  {status}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">Stock: {item.stock}</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      item.stock === 0 ? 'bg-red-500' : 
                      item.stock < 3 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(100, (item.stock / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    
    {items.length > 5 && (
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link to="/inventory" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all {items.length} alerts →
        </Link>
      </div>
    )}
  </div>
);

export default InventoryAlerts;