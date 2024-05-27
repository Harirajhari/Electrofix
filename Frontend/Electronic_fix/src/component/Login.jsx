import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message before submission
        try {
            if (isSignUp) {
                const response = await axios.post('http://localhost:3000/user/signup', formData);
                console.log('Sign Up Response:', response.data);
                // Handle successful signup (e.g., redirect, show message)
            } else {
                const loginData = { email: formData.email, password: formData.password };
                const response = await axios.post('http://localhost:3000/user/login', loginData, { withCredentials: true });
                console.log('Login Response:', response.data);
                navigate("/dashboard");
                // Handle successful login (e.g., save token, redirect)
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Set error message from response
            } else {
                setError('An error occurred during authentication. Please try again.');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 items-center justify-center">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-1/2 bg-cover bg-center bg-electrofixnics-pattern hidden md:block">
                    <div className="flex flex-col h-full justify-center items-center text-8xl font-extrabold">
                        <span>Electro</span>
                        <span>Fix</span>
                        <span>Nics</span>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            {isSignUp ? 'Sign Up' : 'Login'}
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">
                                        Username:
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="mobile" className="block text-gray-700">
                                        Mobile:
                                    </label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-700">
                                Password:
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-4 top-7 flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {error && <div className="mb-4 text-red-500">{error}</div>}
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isSignUp ? 'Sign Up' : 'Login'}
                        </button>
                    </form>
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(''); // Reset error message when switching forms
                        }}
                        className="w-full py-2 mt-4 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
