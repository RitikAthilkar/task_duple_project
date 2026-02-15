import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER}/auth/profile`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setIsAuth(true);
            setUser(res.data.user);
        } catch (error) {
            setIsAuth(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            user,
            setUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
