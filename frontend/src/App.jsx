import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AdminHome from "./pages/AdminHome";
import InventoryPanel from './pages/InventoryPanel';
import OrdersManagementPanel from './pages/OrdersManagementPanel';
import CreateOrderPanel from './pages/CreateOrderPanel';
import Settings from './pages/Settings';
import HelpPanel from './pages/HelpPanel';
import SuppliersPanel from './pages/Suppliers';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPassword"; 
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
    const [user, setUser] = useState(null);

    // Effect to check for stored user data on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> 

                {/* Protected Routes - require user to be logged in */}
                <Route 
                    path="/inventory" 
                    element={user ?<InventoryPanel /> : <Navigate to="/login" />} />
                <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/create-order" 
                    element={user ? <CreateOrderPanel /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/orders" 
                    element={user ? <OrdersManagementPanel /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/settings" 
                    element={user ? <Settings /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/help" 
                    element={user ? <HelpPanel /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/suppliers" 
                    element={user ? <SuppliersPanel /> : <Navigate to="/login" />} 
                />
                
                {/* Admin Protected Route */}
                <Route 
                    path="/admin" 
                    element={user && user.role === "admin" ? <AdminHome /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;