import { Search, Plus } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, onAddItem }) => {
  return (
    <header className="bg-white shadow px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={onAddItem}
          >
            <Plus size={18} className="mr-1" /> Add Item
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;