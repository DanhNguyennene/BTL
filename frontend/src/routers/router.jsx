import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../components/SingleBook";


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
      }
    ]
  },
]);

export default router;