
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        if (token) {
            try {
                // Decode token or fetch user profile if endpoint exists
                // For now, we'll just simulate persistent login
                // Ideally, verify token with backend
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== "undefined") {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Invalid user data found, clear it
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } catch (err) {
                console.error("Failed to parse user from local storage", err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setToken(null);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', data.token);
            // The API returns the user object directly mixed with the token, not nested in .user
            const userData = { ...data };
            delete userData.token; // Optional: don't store token inside user object

            localStorage.setItem('user', JSON.stringify(userData));
            setToken(data.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
            localStorage.setItem('token', data.token);
            // The API returns the user object directly mixed with the token, not nested in .user
            const userData = { ...data };
            delete userData.token;

            localStorage.setItem('user', JSON.stringify(userData));
            setToken(data.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
