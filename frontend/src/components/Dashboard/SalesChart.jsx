import React from 'react';
import { BarChart2 } from 'lucide-react';

const SalesChart = () => {
  // Sample data - replace with real data from your API
  const monthlySales = [
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
  ];

  const maxSales = Math.max(...monthlySales.map(item => item.sales));
  const chartHeight = 200;
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800 flex items-center">
          <BarChart2 className="mr-2" size={20} />
          Monthly Sales Performance
        </h3>
        <select 
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Select time period"
        >
          <option>This Year</option>
          <option>Last Year</option>
          <option>Last 6 Months</option>
        </select>
      </div>
      
      <div className="h-64 w-full">
        <div className="flex items-end h-[200px] space-x-1">
          {monthlySales.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div 
                className={`w-full rounded-t-sm hover:opacity-90 transition-all duration-200 relative ${
                  item.month === currentMonth ? 'bg-blue-600' : 'bg-blue-400'
                }`}
                style={{
                  height: `${(item.sales / maxSales) * chartHeight}px`
                }}
              >
                <div className="hidden group-hover:block absolute -mt-8 px-2 py-1 bg-gray-800 text-white text-xs rounded">
                  ${item.sales.toLocaleString()}
                </div>
              </div>
              <div className={`text-xs mt-2 ${
                item.month === currentMonth ? 'font-bold text-blue-600' : 'text-gray-500'
              }`}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
          <span>$0</span>
          <span>${(maxSales/2).toLocaleString()}</span>
          <span>${maxSales.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;