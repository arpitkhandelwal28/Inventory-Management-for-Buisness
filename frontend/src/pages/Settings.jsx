import  { useState, useEffect } from 'react';
import { 
   Save, Bell, Moon, Check, X 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from '../components/Layout/Sidebar'; 

const SettingsPanel = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        language: 'English',
        autoSave: true
    });

    const [originalSettings, setOriginalSettings] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newPassword, setNewPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            setOriginalSettings(parsedSettings);
        }
    }, []);

    // Check if settings have changed
    useEffect(() => {
        const hasChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
        setIsDirty(hasChanged);
    }, [settings, originalSettings]);

    const handleToggleChange = (setting) => {
        const newSettings = {
            ...settings,
            [setting]: !settings[setting]
        };
        setSettings(newSettings);
        
        if (setting === 'darkMode') {
            document.documentElement.classList.toggle('dark', newSettings.darkMode);
        }
    };

    const handleSelectChange = (setting, value) => {
        setSettings({
            ...settings,
            [setting]: value
        });
    };

    const handleSaveSettings = () => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setOriginalSettings(settings);
        setIsDirty(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setNewPassword(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = () => {
        const errors = {};
        
        if (!newPassword.current) errors.current = 'Current password is required';
        if (!newPassword.new) {
            errors.new = 'New password is required';
        } else if (newPassword.new.length < 8) {
            errors.new = 'Password must be at least 8 characters';
        }
        if (newPassword.new !== newPassword.confirm) {
            errors.confirm = 'Passwords do not match';
        }
        
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://inventory-management-for-buisness.onrender.com/api/auth/change-password',
                {
                    currentPassword: newPassword.current,
                    newPassword: newPassword.new
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            alert('Password changed successfully!');
            setNewPassword({ current: '', new: '', confirm: '' });
            setShowPasswordForm(false);
            setPasswordErrors({});
        } catch (error) {
            setPasswordErrors({
                api: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await axios.delete('https://inventory-management-for-buisness.onrender.com/api/auth/account', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            setApiError(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
            
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className={`shadow px-6 py-4 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold cursor-default">Settings</h2>
                        <button 
                            className={`px-4 py-2 rounded-lg flex items-center ${isDirty ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            onClick={handleSaveSettings}
                            disabled={!isDirty}
                        >
                            <Save size={18} className="mr-1" /> Save
                        </button>
                    </div>
                </header>
                
                <main className="p-6">
                    {showSaveSuccess && (
                        <div className={`mb-4 p-3 rounded-md flex items-center ${settings.darkMode ? 'bg-green-800' : 'bg-green-100'} cursor-default`}>
                            <Check className="mr-2" size={18} />
                            Settings saved successfully!
                        </div>
                    )}

                    <div className={`rounded-lg p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-medium mb-4 cursor-default">Application Settings</h3>
                        
                        {/* Notifications Setting */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-300">
                            <div className="flex items-center">
                                <Bell size={20} className="mr-3" />
                                <div>
                                    <p className="font-medium cursor-default">Notifications</p>
                                    <p className="text-sm opacity-70 cursor-default">Enable email notifications</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.notifications}
                                    onChange={() => handleToggleChange('notifications')}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        {/* Dark Mode Setting */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-300">
                            <div className="flex items-center">
                                <Moon size={20} className="mr-3" />
                                <div>
                                    <p className="font-medium cursor-default">Dark Mode</p>
                                    <p className="text-sm opacity-70 cursor-default">Toggle dark theme</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.darkMode}
                                    onChange={() => handleToggleChange('darkMode')}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        {/* Language Setting */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-300">
                            <div>
                                <p className="font-medium cursor-default">Language</p>
                                <p className="text-sm opacity-70 cursor-default">Select your preferred language</p>
                            </div>
                            <select 
                                className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                value={settings.language}
                                onChange={(e) => handleSelectChange('language', e.target.value)}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                        </div>
                        
                        {/* Auto Save Setting */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center">
                                <Save size={20} className="mr-3" />
                                <div>
                                    <p className="font-medium cursor-default">Auto Save</p>
                                    <p className="text-sm opacity-70 cursor-default">Automatically save changes</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.autoSave}
                                    onChange={() => handleToggleChange('autoSave')}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                    
                    {/* Account Section */}
                    <div className={`rounded-lg p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-medium mb-4 cursor-default">Account</h3>
                        
                        {/* Change Password Section */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 cursor-default">Change Password</h4>
                            {!showPasswordForm ? (
                                <button 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    Update Password
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    {passwordErrors.api && (
                                        <div className={`p-2 rounded-md ${settings.darkMode ? 'bg-red-900' : 'bg-red-100'} text-red-600 cursor-default`}>
                                            {passwordErrors.api}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block mb-1 cursor-pointer">Current Password *</label>
                                        <input
                                            type="password"
                                            name="current"
                                            value={newPassword.current}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${passwordErrors.current ? 'border-red-500' : settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} cursor-text`}
                                            required
                                        />
                                        {passwordErrors.current && <p className="text-red-500 text-sm mt-1 cursor-default">{passwordErrors.current}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-1 cursor-pointer">New Password *</label>
                                        <input
                                            type="password"
                                            name="new"
                                            value={newPassword.new}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${passwordErrors.new ? 'border-red-500' : settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} cursor-text`}
                                            required
                                        />
                                        {passwordErrors.new && <p className="text-red-500 text-sm mt-1 cursor-default">{passwordErrors.new}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-1 cursor-pointer">Confirm New Password *</label>
                                        <input
                                            type="password"
                                            name="confirm"
                                            value={newPassword.confirm}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${passwordErrors.confirm ? 'border-red-500' : settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} cursor-text`}
                                            required
                                        />
                                        {passwordErrors.confirm && <p className="text-red-500 text-sm mt-1 cursor-default">{passwordErrors.confirm}</p>}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button 
                                            type="submit" 
                                            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : 'Save New Password'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`px-4 py-2 rounded-lg cursor-pointer ${settings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setPasswordErrors({});
                                                setNewPassword({
                                                    current: '',
                                                    new: '',
                                                    confirm: ''
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        
                        {/* Delete Account */}
                        <div>
                            <h4 className="font-medium mb-3 cursor-default">Delete Account</h4>
                            <p className="mb-3 text-sm opacity-70 cursor-default">This action cannot be undone. All your data will be permanently deleted.</p>
                            <button 
                                className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isLoading}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-lg max-w-md w-full ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold cursor-default">Confirm Account Deletion</h3>
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {apiError && (
                            <div className={`mb-4 p-2 rounded-md ${settings.darkMode ? 'bg-red-900' : 'bg-red-100'} text-red-600 cursor-default`}>
                                {apiError}
                            </div>
                        )}
                        <p className="mb-6 cursor-default">Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setApiError(null);
                                }}
                                className={`px-4 py-2 rounded-lg cursor-pointer ${settings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;