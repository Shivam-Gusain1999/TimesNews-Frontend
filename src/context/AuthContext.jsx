import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auto-login on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await authApi.getCurrentUser();
                setUser(data.data);
            } catch {
                localStorage.removeItem('accessToken');
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        const { data } = await authApi.login(credentials);
        const { user: userData, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
        toast.success('Logged in successfully');
        return userData;
    };

    const register = async (formData) => {
        const { data } = await authApi.register(formData);
        toast.success('Registration successful! Please login.');
        return data.data;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // logout even if API fails
        }
        localStorage.removeItem('accessToken');
        setUser(null);
        toast.success('Logged out');
    };

    const updateUser = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isEditor: user?.role === 'editor',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
