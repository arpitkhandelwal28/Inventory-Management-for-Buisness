import { CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} className="mr-1" />;
      case 'processed': return <Clock size={16} className="mr-1" />;
      case 'shipped': return <Truck size={16} className="mr-1" />;
      case 'pending': return <AlertCircle size={16} className="mr-1" />;
      case 'cancelled': return <AlertCircle size={16} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor()}`}>
      <div className="flex items-center">
        {getStatusIcon()}
        {status}
      </div>
    </span>
  );
};

export default StatusBadge;