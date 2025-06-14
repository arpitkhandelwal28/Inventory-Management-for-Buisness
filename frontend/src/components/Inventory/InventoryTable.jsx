import { Edit, Trash2, Package, ArrowUp, ArrowDown } from 'lucide-react';

const InventoryTable = ({ 
  inventory, 
  calculateStatus, 
  requestSort, 
  sortConfig, 
  openEditModal, 
  setDeleteConfirm 
}) => {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('productId')}
            >
              <div className="flex items-center">
                ID
                {renderSortIcon('productId')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('name')}
            >
              <div className="flex items-center">
                Product Name
                {renderSortIcon('name')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('category')}
            >
              <div className="flex items-center">
                Category
                {renderSortIcon('category')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('price')}
            >
              <div className="flex items-center">
                Price
                {renderSortIcon('price')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('stock')}
            >
              <div className="flex items-center">
                Stock
                {renderSortIcon('stock')}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-default">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] cursor-default">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map((item) => {
            const { status, color } = calculateStatus(item.stock);
            
            return (
              <tr key={item.productId} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{item.productId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center cursor-default">
                      <Package size={18} className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs cursor-text">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-default">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-default">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-default">
                  {item.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap cursor-default">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap overflow-visible">
                  <div className="flex justify-end gap-2 w-full">
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                      aria-label="Edit item"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(item.productId);
                      }}
                      aria-label="Delete item"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;