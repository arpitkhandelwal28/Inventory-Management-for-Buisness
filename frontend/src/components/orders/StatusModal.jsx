import  { useState } from 'react';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StatusModal = ({ isOpen, order, onClose, onStatusUpdate }) => {
  const [statusUpdate, setStatusUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const statusOptions = ['pending', 'processed', 'shipped', 'delivered', 'cancelled'];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(statusUpdate);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Order Status</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Status: <StatusBadge status={order?.status} />
          </label>
          <select
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border cursor-pointer"
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
          >
            <option value="">Select new status</option>
            {statusOptions.map(status => (
              <option 
                key={status} 
                value={status}
                disabled={status === order?.status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!statusUpdate || isUpdating}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              !statusUpdate ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            }`}
          >
            {isUpdating ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Updating...
              </>
            ) : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;