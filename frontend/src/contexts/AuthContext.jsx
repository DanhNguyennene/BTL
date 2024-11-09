import { createContext, useState, useContext, useEffect } from "react";
import api from '../api/axios'

const AuthContext = createContext(null);


export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            try{
                const token = localStorage.getItem('token')
                const userData = localStorage.getItem('user')

                if (token && userData) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    const parsedUser = JSON.parse(userData);
                    setUserInfo(parsedUser);
                }
            }catch(error){
                console.error("Error loading auth state: ", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];

            }finally{
                setLoading(false);
            }
        }
        checkAuth();
    }, []);


    const login = async (username, password) => {
        try {
            console.log('Attempting login with:', { username });
            const response = await api.post('/api/users/signin', {
                username,
                password
            });
            
            console.log('Login response:', response.data);
            
            const { token, user } = response.data;
            
            if (!token || !user) {
                console.error('Missing token or user_data in response:', response.data);
                throw new Error('Invalid response data');
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Stored user data:', user);
            
            setUserInfo(user);
            console.log("USERINFO: ", userInfo);
            return { success: true, user: user };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };



    const logout = () => {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUserInfo(null);
    }
    if(loading){
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider
            value= {{
                userInfo,
                login,
                logout,
                isAuthenticated: !!userInfo,
                isEmployee: userInfo?.user_type === 'employee',
                isCustomer: userInfo?.user_type === 'customer'
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}