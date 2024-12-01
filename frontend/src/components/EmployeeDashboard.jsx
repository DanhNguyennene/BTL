import React, {useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaBell, FaUser, FaHome } from 'react-icons/fa';

import { 
  FaBook, 
  FaShoppingCart, 
  FaUserEdit, 
  FaBoxes,
  FaChartLine,
  FaBookReader,
  FaBuilding
} from 'react-icons/fa';


import DashBoardOverview from './employeeDashboard/DashBoardOverview';
import BookManagement from './employeeDashboard/BookManagement';
import PublisherOrders from './employeeDashboard/PublisherOrders';
import AuthorManagement from './employeeDashboard/AuthorManagement';
import GenreManagement from './employeeDashboard/GenreManagement';
import PublisherManagement from './employeeDashboard/PublisherManagement';
import CustomerOrders from './employeeDashboard/CustomerOrders';
import EmployeeNotifications from './EmployeeNotifications';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const tabs = [
    { id: 'overview', name: 'Dashboard Overview', icon: <FaChartLine /> },
    { id: 'books', name: 'Book Management', icon: <FaBook /> },
    { id: 'customer-orders', name: 'Customer Orders', icon: <FaShoppingCart /> },
    { id: 'publisher-orders', name: 'Publisher Orders', icon: <FaBoxes /> },
    { id: 'authors', name: 'Author Management', icon: <FaUserEdit /> },
    { id: 'genres', name: 'Genre Management', icon: <FaBookReader /> },
    { id: 'publishers', name: 'Publisher Management', icon: <FaBuilding /> },
    {
      id: 'notifications', 
      name: 'Notifications', 
      icon: <FaBell />,
      description: 'Stay updated with latest alerts'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashBoardOverview />;
      case 'books':
        return <BookManagement />;
      case 'customer-orders':
        return <CustomerOrders />;
      case 'publisher-orders':
        return <PublisherOrders />;
      case 'authors':
        return <AuthorManagement />;
      case 'genres':
        return <GenreManagement />;
      case 'publishers':
        return <PublisherManagement />;
      case 'notifications':
        return <EmployeeNotifications/>
      default:
        return <DashBoardOverview />;
    }
  };
  return (
    // a dashboard to add new books, update books, delete books
    <div className='flex h-screen bg-white pt-16'>
      <div className='w-64 bg-white shadow-lg'>
        {/* <div className='p-4'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Employee - Portal
          </h2>
        </div> */}
        <nav className='mt-4'>
            {tabs.map((tab) => (
              <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-lg flex items-center px-6 py-5 text-left ${activeTab === tab.id? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50'}`}
              >
                <span className='mr-3 text-3xl'>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
        </nav>
      </div>

      <div className='flex-1 overflow-auto'>
        <div className='p-10'>
            {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
