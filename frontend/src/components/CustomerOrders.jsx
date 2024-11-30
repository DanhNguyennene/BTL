import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

const CustomerOrders = () => {
    const { userInfo, logout, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            logout();
            return;
        }

        // Fetch orders
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/books/order/${userInfo.username}`);
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, logout, userInfo.username]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="text-yellow-500 mr-2" />;
            case 'completed':
                return <CheckCircle className="text-green-500 mr-2" />;
            case 'cancelled':
                return <XCircle className="text-red-500 mr-2" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                    <div className="flex items-center">
                        <BookOpen className="w-10 h-10 text-indigo-600 mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome, <span className="text-indigo-600">{userInfo.username}</span>
                            </h1>
                            <p className="text-gray-600 mt-2">Here's a summary of your book orders.</p>
                        </div>
                    </div>
                </div>

                <div>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-pulse">
                                <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex flex-col sm:flex-row items-center p-6">
                                        <img
                                            src={item.imageURL}
                                            alt={item.title}
                                            className="w-32 h-48 object-cover rounded-lg shadow-md mb-4 sm:mb-0 sm:mr-6"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                                {item.title}
                                            </h2>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Author:</span> {item.authorName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Publisher:</span> {item.publisherName}
                                                </p>
                                                <div className="flex items-center">
                                                    <span className="text-lg font-bold text-indigo-600 mr-4">
                                                        ${item.price}
                                                    </span>
                                                    <p className="text-sm text-gray-500">
                                                        Ordered on: {new Date(item.order_time).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    {getStatusIcon(item.order_status)}
                                                    <span
                                                        className={`text-sm font-medium capitalize ${
                                                            item.order_status === "pending"
                                                                ? "text-yellow-600"
                                                                : item.order_status === "completed"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {item.order_status} Status
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-xl p-8 text-center">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No Orders Yet
                            </h3>
                            <p className="text-sm text-gray-500">
                                Explore our collection and place your first order!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerOrders;