import { useInventory } from '../hooks/useInventory';
import Sidebar from '../components/Layout/Sidebar';
import MetricCard from '../components/Dashboard/MetricCard';
import SalesChart from '../components/Dashboard/SalesChart';
import InventoryAlerts from '../components/Dashboard/InventoryAlerts';
import RecentOrders from '../components/Dashboard/RecentOrders';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import {
  Package, DollarSign, AlertTriangle, TrendingUp, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const {
    inventory,
    loading: inventoryLoading,
    error: inventoryError,
    success,
    calculateInventoryMetrics,
    calculateStatus,
    fetchInventory
  } = useInventory();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', { withCredentials: true });
        setOrders(response.data);
      } catch (err) {
        setOrdersError('Failed to fetch orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [monthlySales] = useState([
    { month: 'Jan', sales: 12500 },
    { month: 'Feb', sales: 14800 },
    { month: 'Mar', sales: 13200 },
    { month: 'Apr', sales: 15700 },
    { month: 'May', sales: 18900 },
    { month: 'Jun', sales: 17500 },
    { month: 'Jul', sales: 19200 },
    { month: 'Aug', sales: 21500 },
    { month: 'Sep', sales: 22800 },
    { month: 'Oct', sales: 20100 },
    { month: 'Nov', sales: 23400 },
    { month: 'Dec', sales: 24900 }
  ]);

  const inventoryMetrics = calculateInventoryMetrics();
  const criticalItems = inventory.filter(item => item.stock < 5);

  if (inventoryLoading && inventory.length === 0) return <Loading />;
  if (inventoryError && !success) return <Error error={inventoryError} onRetry={fetchInventory} />;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Overview</h1>

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Total Products"
              value={inventoryMetrics.totalItems}
              icon={<Package size={24} />}
              trend={`${Math.round((inventoryMetrics.totalItems / (inventoryMetrics.totalItems + 50)) * 100)}% of capacity`}
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Inventory Value"
              value={`$${inventoryMetrics.inventoryValue.toLocaleString()}`}
              icon={<DollarSign size={24} />}
              trend={<span className="text-green-600 flex items-center"><ArrowUpRight size={16} className="mr-1" /> 12.5% from last month</span>}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <MetricCard
              title="Critical Alerts"
              value={criticalItems.length}
              icon={<AlertTriangle size={24} />}
              trend={`${criticalItems.filter(item => item.stock === 0).length} out of stock`}
              bgColor="bg-red-100"
              iconColor="text-red-600"
            />
            <MetricCard
              title="Monthly Sales"
              value={`$${monthlySales.find(m => m.month === new Date().toLocaleString('default', { month: 'short' })).sales.toLocaleString()}`}
              icon={<TrendingUp size={24} />}
              trend={<span className="text-green-600 flex items-center"><ArrowUpRight size={16} className="mr-1" /> 8.2% growth</span>}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <SalesChart data={monthlySales} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Inventory Health</h3>
              <div className="space-y-4">
                {Object.entries(inventoryMetrics.categoriesCount).map(([category, count]) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category}</span>
                      <span>{count} items</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / inventoryMetrics.totalItems) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {!ordersLoading && !ordersError && (
              <RecentOrders orders={orders} />
            )}
            <InventoryAlerts items={criticalItems} calculateStatus={calculateStatus} />
          </div>

          {ordersLoading && (
            <div className="text-center text-sm text-gray-500">Loading Orders...</div>
          )}
          {ordersError && (
            <div className="text-center text-red-600">{ordersError}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;