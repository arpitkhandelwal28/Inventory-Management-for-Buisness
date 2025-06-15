import  { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingCart, PlusCircle, MinusCircle, XCircle, Package, DollarSign, Loader } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar'; 

const CreateOrderPanel = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState(null);
    const [cart, setCart] = useState([]);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateCartTotal = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p.productId === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    useEffect(() => {
        const fetchInventoryProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await axios.get('https://inventory-management-for-buisness.onrender.com/api/items', {
                    withCredentials: true
                });
                setProducts(response.data.items);
                setErrorProducts(null);
            } catch (err) {
                console.error('Error fetching inventory products:', err);
                setErrorProducts('Failed to load products.');
                toast.error('Failed to load products.');
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchInventoryProducts();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.productId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { productId: product.productId, quantity: 1 }];
            }
        });
        toast.info(`${product.name} added to cart!`, { autoClose: 1000 });
    };

    const updateCartQuantity = (productId, change) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            );
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
        toast.warn('Item removed from cart.', { autoClose: 1000 });
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty. Add items before placing an order.');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const orderProducts = cart.map(item => ({
                product: item.productId,
                quantity: item.quantity
            }));

            const response = await axios.post('https://inventory-management-for-buisness.onrender.com/api/orders', {
                products: orderProducts
            }, {
                withCredentials: true
            });

            toast.success(`Order ${response.data._id} placed successfully!`);
            setCart([]);
        } catch (err) {
            console.error('Error placing order:', err);
            let errorMessage = 'Failed to place order.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <ToastContainer position="bottom-right" autoClose={5000} />
                <header className="bg-white shadow px-3 sm:px-6 py-4 mb-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <ShoppingCart className="mr-2" /> Create New Order
                    </h2>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <Package className="mr-2" size={20} /> Available Products
                        </h3>
                        {loadingProducts ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin text-gray-500 mx-auto" size={32} />
                                <p className="mt-2 text-gray-600">Loading products...</p>
                            </div>
                        ) : errorProducts ? (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                                <p className="font-medium">Error:</p>
                                <p>{errorProducts}</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
                                No products found in inventory.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.map(product => (
                                    <div key={product.productId} className="border p-4 rounded-lg flex flex-col justify-between items-center text-center">
                                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                                        <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors cursor-pointer"
                                        >
                                            <PlusCircle size={18} className="mr-2" /> Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="md:col-span-1 bg-white p-6 rounded-lg shadow sticky top-6 self-start">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <ShoppingCart className="mr-2" size={20} /> Your Cart
                        </h3>
                        {cart.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">Your cart is empty. Add some products!</div>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {cart.map(cartItem => {
                                        const productDetails = products.find(p => p.productId === cartItem.productId);
                                        if (!productDetails) return null;

                                        return (
                                            <div key={cartItem.productId} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                                <div>
                                                    <p className="font-medium text-gray-800">{productDetails.name}</p>
                                                    <p className="text-sm text-gray-600">{formatCurrency(productDetails.price)} x {cartItem.quantity}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateCartQuantity(cartItem.productId, -1)}
                                                        className="p-1 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <MinusCircle size={20} />
                                                    </button>
                                                    <span className="font-semibold">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartQuantity(cartItem.productId, 1)}
                                                        className="p-1 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <PlusCircle size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(cartItem.productId)}
                                                        className="p-1 rounded-full text-red-500 hover:bg-red-100 cursor-pointer"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                                    <p className="text-lg font-bold text-gray-800 flex items-center">
                                        <DollarSign size={20} className="mr-1" /> Total: {formatCurrency(calculateCartTotal())}
                                    </p>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isPlacingOrder || cart.length === 0}
                                        className={`px-6 py-3 rounded-md text-white font-semibold flex items-center justify-center transition-colors ${
                                            isPlacingOrder || cart.length === 0
                                                ? 'bg-green-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                                        }`}
                                    >
                                        {isPlacingOrder ? (
                                            <>
                                                <Loader className="animate-spin mr-2" size={20} /> Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="mr-2" size={20} /> Place Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CreateOrderPanel;



