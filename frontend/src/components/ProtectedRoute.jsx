import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export const ProtectedRoute = ({children, allowedRoles}) => {
    const {userInfo, isAuthenticated, loading} = useAuth();

    console.log("Inside ProtectedRoute, user: ", userInfo)
    console.log("Inside ProtectedRoute, isAuthenticated: ", isAuthenticated)

    const location = useLocation();
    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.user_type)){
        return <Navigate to='/' replace/>
    }
    return children
}