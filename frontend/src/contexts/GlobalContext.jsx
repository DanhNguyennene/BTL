import { createContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext();

// Create the provider
export const GlobalProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Function to update the global state
    const updateCart = (value) => {
        // pushback new value to the cart
        setCart([...cart, value]);
    };

    const resetCart = () => {
        setCart([]);
    }

    const removeItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    }
    return (
        <GlobalContext.Provider value={{ cart, updateCart, resetCart, removeItem }}>
            {children}
        </GlobalContext.Provider>
    );
};
