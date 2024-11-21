import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../components/SingleBook";
import SignUp from "../components/SignUp";
import Signin from "../components/Signin";
import { ProtectedRoute } from "../components/ProtectedRoute";
import EmployeeDashboard from "../components/EmployeeDashboard";
import CustomerDashboard from "../components/CustomerDashboard";
import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router-dom";
import CustomerOrdersDetail from "../components/employeeDashboard/CustomerOrdersDetail";
import PublisherOrdersDetail from "../components/employeeDashboard/PublisherOrdersDetail";

import Checkout from "../shop/Checkout";

const AuthenticatedLayout = ({children}) => {
  const{userInfo} = useAuth();
  return (
    <div>
      <Outlet/>
    </div>
  );
} 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/shop',
        element: <Shop/>
      },
      {
        path:'/about',
        element: <About/>
      }, 
      {
        path: '/blog',
        element: <Blog/>
      },
      {
        path: "/books-info/:id",
        element : <SingleBook/>,
        loader:({params}) => fetch(`http://localhost:5000/api/books/${params.id}`)
      },
      {
        path: "/signup",
        element: <SignUp/>
      },
      {
        path: "/signin",
        element:<Signin/>
      },
      {
        path: '/:username/',
        element: <AuthenticatedLayout/>,
        children:[
          {
            path: '',
            element:
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          },

          {
            path: 'shop',
            element:  
              <ProtectedRoute>
                <Shop/>
              </ProtectedRoute>
          },
          {
            path: 'about',
            element: <ProtectedRoute>
              <About/>
            </ProtectedRoute>
          },
          {
            path: 'blog',
            element: <ProtectedRoute>
              <Blog/>
            </ProtectedRoute>
          },
          {
            path: 'books-info/:id',
            element: <ProtectedRoute>
              <SingleBook/>
            </ProtectedRoute>,
            loader: ({params}) => fetch(`http://localhost:5000/api/books/${params.id}`)
          },
          {
            path:'employee-dashboard',
            element: (
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard/>
              </ProtectedRoute>
            )
          },
          {
            path:'customer-dashboard',
            element:(
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard/>
              </ProtectedRoute>
            )
          },
          {
            path: 'employee-dashboard/:customerUsername/order-details',
            element: (
              <ProtectedRoute allowedRoles={['employee']}>
                <CustomerOrdersDetail/>
              </ProtectedRoute>
            )
          },
          {
            path: 'cart',
            element: (
              <ProtectedRoute allowedRoles={['customer']}>
                <Checkout />
              </ProtectedRoute>
            )
          },
          {
            path: 'employee-dashboard/:employeeUsername/publisher-order-details',
            element: (
              <ProtectedRoute allowedRoles={['employee']}>
                <PublisherOrdersDetail/>
              </ProtectedRoute>
            )
          }
          
        ]
      }
      
    ]
  },
]);

export default router;