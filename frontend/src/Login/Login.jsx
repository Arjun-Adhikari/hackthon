import React, { useState } from 'react';
import axios from 'axios';

export default function Login ()  {
    const [activeTab, setActiveTab] = useState('login');
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle login form changes
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle signup form changes
    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate login form
    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    // Validate signup form
    const validateSignup = () => {
        const newErrors = {};
        if (!signupData.name) {
            newErrors.name = 'Name is required';
        }
        if (!signupData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!signupData.password) {
            newErrors.password = 'Password is required';
        } else if (signupData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (signupData.password !== signupData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateLogin();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with your actual API endpoint
            const response = await axios.post('/api/auth/login', {
                email: loginData.email,
                password: loginData.password
            });

            console.log('Login successful:', response.data);
            // Handle successful login (e.g., save token, redirect)
            // localStorage.setItem('token', response.data.token);
            // navigate('/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: error.response?.data?.message || 'Login failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle signup submission
    const handleSignup = async (e) => {
        e.preventDefault();
        const validationErrors = validateSignup();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with your actual API endpoint
            const response = await axios.post('/api/auth/signup', {
                name: signupData.name,
                email: signupData.email,
                password: signupData.password
            });

            console.log('Signup successful:', response.data);
            // Handle successful signup (e.g., save token, redirect, or switch to login)
            // setActiveTab('login');
            // Or auto-login after signup

        } catch (error) {
            console.error('Signup error:', error);
            setErrors({
                general: error.response?.data?.message || 'Signup failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 lg:p-10">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                {/* Hero Section */}
                <div className="text-center lg:text-left space-y-6 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight">
                        Welcome to Our Platform
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Join thousands of users who trust our platform for their daily needs.
                        Experience seamless productivity and collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button
                            onClick={() => setActiveTab('signup')}
                            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => setActiveTab('login')}
                            className="px-8 py-3.5 bg-transparent border-2 border-slate-600 text-white font-semibold rounded-xl hover:border-cyan-500 hover:bg-cyan-500/5 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl animate-fade-in-up">
                    {/* Top Border Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-t-2xl"></div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 p-1 bg-slate-900/50 rounded-xl">
                        <button
                            onClick={() => {
                                setActiveTab('login');
                                setErrors({});
                            }}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'login'
                                    ? 'bg-slate-800 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('signup');
                                setErrors({});
                            }}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'signup'
                                    ? 'bg-slate-800 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-5 animate-fade-in">
                            <div>
                                <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="signup-name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.name
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="signup-password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="signup-confirm" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="signup-confirm"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={signupData.confirmPassword}
                                    onChange={handleSignupChange}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

