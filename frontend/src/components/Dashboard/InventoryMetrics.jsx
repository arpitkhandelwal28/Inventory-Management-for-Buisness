import { Package, AlertTriangle, Box, DollarSign } from 'lucide-react';

const InventoryMetrics = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Products Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-800">{metrics.totalItems}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Package className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Low Stock Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">Low Stock</p>
            <h3 className="text-2xl font-bold text-gray-800">{metrics.lowStockItems}</h3>
            <div className="flex items-center mt-2 text-sm">
              <AlertTriangle size={16} className="mr-1 text-yellow-600" />
              <span className="text-gray-500">Items below threshold</span>
            </div>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Out of Stock Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
            <h3 className="text-2xl font-bold text-gray-800">{metrics.outOfStockItems}</h3>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Box className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Inventory Value Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">Inventory Value</p>
            <h3 className="text-2xl font-bold text-gray-800">
              ${metrics.inventoryValue.toLocaleString()}
            </h3>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMetrics;