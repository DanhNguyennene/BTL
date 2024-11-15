import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';



const CustomerOrders = () => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilters] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')



  return (
    <div>
      Hello
    </div>
  )
}

export default CustomerOrders
