import  { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar'; 
const HelpPanel = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'Medium'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        subject: '',
        message: '',
        priority: 'Medium'
      });
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Help Center</h2>
          </div>
        </header>
        
        <main className="p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <MessageSquare size={24} className="text-gray-600 mr-3" />
              <h3 className="text-lg font-medium">Contact Support</h3>
            </div>
            
            {isSubmitted ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center">
                <span className="mr-2">✔</span>
                Your message has been sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      className="w-full px-3 py-2 border rounded-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 cursor-pointer">Priority</label>
                    <select 
                      name="priority"
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Message</label>
                    <textarea 
                      name="message"
                      rows="5" 
                      className="w-full px-3 py-2 border rounded-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      placeholder="Describe your issue in detail..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-black text-white px-4 py-3.5 rounded-2xl flex items-center hover:bg-gray-700 cursor-pointer"
                  >
                    <Send size={18} className="mr-1" /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPanel;