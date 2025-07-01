import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [setUser]);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return true;
        } else {
            setError('Invalid email or password');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return { login, logout, loading, error };
};

export default useAuth;