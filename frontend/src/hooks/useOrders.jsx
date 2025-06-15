import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://inventory-management-for-buisness.onrender.com/api/orders', { withCredentials: true });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      let message = 'Failed to load orders';
      if (err.response) {
        message = err.response.data?.message || `Server error: ${err.response.status}`;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, fetchOrders };
};
