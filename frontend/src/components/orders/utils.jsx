export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

export const getSortedOrders = (orders, searchQuery, statusFilter, sortConfig) => {
  let filteredOrders = [...orders];
  
  // Apply search filter
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(order => 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Apply status filter
  if (statusFilter !== 'All') {
    filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
  }
  
  // Apply sorting
  filteredOrders.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  return filteredOrders;
};