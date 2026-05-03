import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/authHooks';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/stocks';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        const success = await login(formData.email, formData.password);

        if (success) {
            toast.success('Logged in successfully!');
            navigate(from, { replace: true });
        } else {
            toast.error('Invalid credentials. Please try again or check your email.');
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 flex items-center justify-center">
            <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-500 overflow-y-auto">
                <div className="text-center mb-8 w-full max-w-sm">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl shadow-indigo-200">
                        <FiLogIn />
                    </div>
                    <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Welcome Back</h1>
                    <p className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest mt-2">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                autoComplete="username"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                autoComplete="current-password"
                                className="w-full pl-12 pr-12 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-indigo-600 transition-colors"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <div className="flex justify-end px-1">
                            <Link 
                                to="/forgot-password" 
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-600 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm mt-4"
                    >
                        Login <FiArrowRight />
                    </button>
                </form>

                <p className="text-center mt-8 text-indigo-900/40 font-bold text-xs uppercase tracking-widest">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700">
                        Sign Up Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

