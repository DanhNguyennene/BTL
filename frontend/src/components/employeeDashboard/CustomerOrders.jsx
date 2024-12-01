import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const CustomerOrders = () => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilters] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { userInfo, isAuthenticated, isEmployee, isCustomer } = useAuth();

  const navigate = useNavigate();
  
  const fetchOrders = async () => {
    try{
      const response = await api.get('/api/books/orders');
      const filteredOrders = response.data.filter(
        (order) => order.order_status !== 'inCart'
      );

      
      setOrders(filteredOrders);
    }catch(error){
      console.error("Error fetching orders: ", error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (statuss) => {
    const statusColors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[statuss] || 'bg-gray-100 text-gray-800';
  };

  /* 
    CREATE TABLE `ORDER` (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_time DATETIME,
    order_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled', 'Failed'),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES CUSTOMER(username)
	    ON UPDATE CASCADE
      ON DELETE CASCADE
);
  
  
  */
  const filteredOrders = orders.filter(order => {
    const matchesFilters = filter === "all" || order.order_status .toLowerCase() === filter.toLowerCase();
    const matchesSearchs = order.username.toLowerCase().includes(searchQuery.toLowerCase()) || order.order_id.toString().includes(searchQuery)
    return matchesFilters && matchesSearchs;
  })


  const navigateUserOrders = (username) => {
    navigate(`/${userInfo.username}/employee-dashboard/${username}/order-details`)
  }
  

  return (
    <div className='p-6 mt-5'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-4 '>Customers</h1>
        <div className='flex flex-col md:flex-row gap-6 mb-6'>
          
          {/* Search */}
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by username or orderID'
              className="
                w-full
                px-4 py-2
                border border-gray-300 rounded-lg
                shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                transition-all duration-300 ease-in-out
                hover:shadow-lg hover:border-blue-400
                focus:scale-100
              "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          {/* Filter */}
          <div className='flex gap-2'>
            <select
              className="
                w-full
                px-4 py-2
                border border-gray-300 rounded-lg
                shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                transition-all duration-300 ease-in-out
                hover:shadow-lg hover:border-blue-400
                focus:scale-100
              "
              value={filter}
              onChange={(e) => setFilters(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

          {/* Order grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No orders found matching your criteria
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
                      <p className="text-gray-600">@{order.username}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Ordered on: {format(new Date(order.order_time), 'PPp')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Order Details:</h4>
                    {order.books.length === 0 ? (
                      <p className="text-gray-500 italic">No books in this order</p>
                    ) : (
                      <div className="space-y-2">
                        {order.books.map((book, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded overflow-y-auto max-h-40">
                            <span>Book ID: {book.book_id}</span>
                            <span className="text-gray-600">Qty: {book.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button 
                      onClick={() => navigateUserOrders(order.username)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Full Details →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              {['Completed', 'Pending', 'Processing', 'Cancelled'].map((statuss) => {
                const count = orders.filter(order => order.order_status === statuss).length;
                return (
                  <div key={statuss} className='bg-white rounded-lg shadow p-4' >
                      <h3 className="text-gray-600 text-sm">{statuss} Orders</h3>
                      <p className="text-2xl font-bold mt-2">{count}</p>
                  </div>
                )
              })}
          </div>
      </div>
    </div>
  )
}

export default CustomerOrders
