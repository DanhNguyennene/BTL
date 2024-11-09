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
        path: "/api/books/:id",
        element : <SingleBook/>,
        loader:({params}) => fetch(`http://localhost:5000/api/books/${params.id}`)
        // FETCH: chỗ này fetch từ mongodb thẳng qua thg prop SingleBook : D
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
            path: 'books/:id',
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
          }
        ]
      }
      
    ]
  },
]);

export default router;