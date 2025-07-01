import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleLogin = async (email, password) => {
        const success = await login(email, password);
        if (success) {
            history.push('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <LoginForm onLogin={handleLogin} />
            </div>
        </div>
    );
};

export default Login;