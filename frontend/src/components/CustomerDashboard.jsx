import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaBell, FaUser, FaHome } from 'react-icons/fa';

import CustomerOrders from './CustomerOrders';
import CustomerNotification from './CustomerNotification';
import { useAuth } from '../contexts/AuthContext';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { userInfo } = useAuth();

  const tabs = [
    {
      id: 'orders', 
      name: 'My Orders', 
      icon: <FaShoppingBag />,
      description: 'Track and manage your purchases'
    },
    {
      id: 'notifications', 
      name: 'Notifications', 
      icon: <FaBell />,
      description: 'Stay updated with latest alerts'
    }
  ];

  const renderContent = () => {
    switch(activeTab){
      case 'orders': 
        return <CustomerOrders/>;
      case 'notifications':
        return <CustomerNotification/>;
      default:
        return <CustomerOrders/>;
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className='w-72 bg-white shadow-2xl border-r border-gray-200 p-6'
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='flex items-center mb-10 space-x-4 bg-blue-50 p-4 rounded-xl'
        >
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
            <FaUser className='text-blue-500 text-2xl' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-800'>{userInfo.username}</h2>
            <p className='text-sm text-gray-500'>Welcome back!</p>
          </div>
        </motion.div>

        <nav className='space-y-2'>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-300 group
                ${activeTab === tab.id 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              <div className='flex items-center space-x-4'>
                <span className={`
                  text-2xl transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-400 group-hover:text-blue-500'}
                `}>
                  {tab.icon}
                </span>
                <div>
                  <h3 className='font-semibold'>{tab.name}</h3>
                  <p className='text-xs opacity-70'>{tab.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </nav>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className='flex-1 p-10 bg-gray-100 overflow-y-auto'
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;