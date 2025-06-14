import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const validCategories = [
  "Electronics", "Clothing", "Footwear", "Home & Kitchen",
  "Grocery", "Health & Personal Care", "Books", "Furniture",
  "Toys", "Sports & Fitness", "Beauty & Fashion", "Automotive",
  "Jewelry", "Office Supplies", "Baby Products"
];

export const useInventory = () => {
  const [state, setState] = useState({
    inventory: [],
    loading: true,
    error: null,
    success: null,
    searchQuery: '',
    sortConfig: { key: 'productId', direction: 'ascending' },
    categoryFilter: 'All',
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1
    },
    categories: ['All', ...validCategories]
  });

  const fetchInventory = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { searchQuery, categoryFilter, pagination, sortConfig } = state;
      const params = {
        search: searchQuery,
        category: categoryFilter === 'All' ? null : categoryFilter,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortConfig.key === 'price' ? 
          (sortConfig.direction === 'ascending' ? 'price_asc' : 'price_desc') : null
      };

      const response = await axios.get('http://localhost:5000/api/items', { params });
      
      setState(prev => ({
        ...prev,
        inventory: response.data.items,
        pagination: {
          ...prev.pagination,
          totalItems: response.data.totalItems,
          totalPages: Math.ceil(response.data.totalItems / prev.pagination.limit)
        },
        categories: ['All', ...new Set(response.data.items.map(item => item.category))],
        loading: false,
        error: null
      }));
      
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error || 'Failed to fetch inventory'
      }));
      console.error('Error fetching inventory:', err);
    }
  }, [state.searchQuery, state.categoryFilter, state.sortConfig, state.pagination.page, state.pagination.limit]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const calculateStatus = (stock) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 5) return { status: 'Critical', color: 'bg-orange-100 text-orange-800' };
    if (stock < 10) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const calculateInventoryMetrics = useCallback(() => {
    const { inventory, pagination } = state;
    const totalItems = pagination.totalItems;
    const lowStockItems = inventory.filter(item => item.stock < 10).length;
    const outOfStockItems = inventory.filter(item => item.stock === 0).length;
    const inventoryValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
    
    const categoriesCount = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
      categoriesCount
    };
  }, [state.inventory, state.pagination.totalItems]);

  const requestSort = (key) => {
    setState(prev => {
      const direction = prev.sortConfig.key === key && prev.sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending';
      return { ...prev, sortConfig: { key, direction } };
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.pagination.totalPages) {
      setState(prev => ({ ...prev, pagination: { ...prev.pagination, page: newPage } }));
    }
  };

  const performInventoryOperation = async (operation, url, data = null, successMessage) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await (operation === 'delete' 
        ? axios.delete(url) 
        : operation === 'put' 
          ? axios.put(url, data) 
          : axios.post(url, data));

      // Immediately update local state for better UX
      if (operation === 'delete') {
        setState(prev => ({
          ...prev,
          inventory: prev.inventory.filter(item => item.productId !== data),
          loading: false,
          success: successMessage,
          error: null,
          pagination: {
            ...prev.pagination,
            totalItems: prev.pagination.totalItems - 1
          }
        }));
      } else if (operation === 'put') {
        setState(prev => ({
          ...prev,
          inventory: prev.inventory.map(item => 
            item.productId === data.productId ? { ...item, ...data } : item
          ),
          loading: false,
          success: successMessage,
          error: null
        }));
      } else {
        // For add operations, we need to fetch to get the complete data
        await fetchInventory();
        setState(prev => ({
          ...prev,
          loading: false,
          success: successMessage,
          error: null
        }));
      }
      
      return true;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.error || `Failed to ${operation} item`,
        loading: false
      }));
      return false;
    }
  };

  const addItem = (itemData) => 
    performInventoryOperation('post', 'http://localhost:5000/api/items', itemData, 'Item added successfully!');

  const updateItem = (id, itemData) => 
    performInventoryOperation('put', `http://localhost:5000/api/items/${id}`, { productId: id, ...itemData }, 'Item updated successfully!');

  const deleteItem = (id) => 
    performInventoryOperation('delete', `http://localhost:5000/api/items/${id}`, id, 'Item deleted successfully!');

  const setSearchQuery = (query) => setState(prev => ({ ...prev, searchQuery: query }));
  const setCategoryFilter = (filter) => setState(prev => ({ ...prev, categoryFilter: filter }));
  const setSuccess = (message) => setState(prev => ({ ...prev, success: message }));
  const setError = (message) => setState(prev => ({ ...prev, error: message }));

  useEffect(() => {
    if (state.success || state.error) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, success: null, error: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.error]);

  return {
    ...state,
    fetchInventory,
    calculateStatus,
    calculateInventoryMetrics,
    requestSort,
    handlePageChange,
    addItem,
    updateItem,
    deleteItem,
    setSearchQuery,
    setCategoryFilter,
    setSuccess,
    setError,
    validCategories
  };
};