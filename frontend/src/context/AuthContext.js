import React, { createContext, useState } from 'react';
import { mockApiCall, MOCK_DB } from '../api/mockApi';
import { MOCK_API_BASE } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(MOCK_DB.currentUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockApiCall('POST', `${MOCK_API_BASE}/auth/login`, { username, password });
            MOCK_DB.currentUser = response.user; // Update Mock DB State
            setUser(response.user); 
            return true;
        } catch (err) {
            setError(err.message || 'Lỗi đăng nhập');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        MOCK_DB.currentUser = null;
    };

    const isAuthorized = (roles) => {
        return user && roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthorized }}>
            {children}
        </AuthContext.Provider>
    );
};