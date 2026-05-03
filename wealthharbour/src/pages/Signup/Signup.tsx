import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/authHooks';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        gender: '',
        dob: '',
        password: '',
        retypePassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const { signup, error: authError, resetError } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetError();

        if (!formData.username || !formData.email || !formData.mobile || !formData.gender || !formData.dob || !formData.password || !formData.retypePassword) {
            toast.error('All fields are required');
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (formData.password !== formData.retypePassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const success = await signup({
            username: formData.username,
            email: formData.email,
            mobile: formData.mobile,
            gender: formData.gender,
            dob: formData.dob,
            password: formData.password
        });

        if (success) {
            toast.success('Account created successfully!');
            navigate('/stocks');
        } else {
            // Show the specific backend error message if available
            const errorMsg = authError || 'Signup failed. Please try again.';
            if (errorMsg.includes('email')) {
                toast.error('This email address is already registered. Please use a different one.');
            } else if (errorMsg.includes('number') || errorMsg.includes('phone')) {
                toast.error('This mobile number is already registered. Please use a different one.');
            } else if (errorMsg.includes('username')) {
                toast.error('This username is already taken. Please choose another.');
            } else {
                toast.error(errorMsg);
            }
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 flex items-center justify-center">
            <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-500 overflow-y-auto">
                <div className="text-center mb-8 w-full max-w-lg">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl shadow-indigo-200">
                        <FiShield />
                    </div>
                    <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Create Account</h1>
                    <p className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest mt-2">Join WealthHarbor</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
                    <div className="space-y-1">
                        <div className="relative group">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="UserName"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                autoComplete="email"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                autoComplete="tel"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest ml-1">Gender</label>
                            <select
                                className="w-full px-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 appearance-none cursor-pointer"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest ml-1">Date of Birth</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                autoComplete="new-password"
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
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type={showRetypePassword ? "text" : "password"}
                                placeholder="Retype Password"
                                autoComplete="new-password"
                                className="w-full pl-12 pr-12 py-3 bg-white border border-indigo-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                value={formData.retypePassword}
                                onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowRetypePassword(!showRetypePassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-indigo-600 transition-colors"
                            >
                                {showRetypePassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm mt-4"
                    >
                        Sign Up <FiArrowRight />
                    </button>
                </form>

                <p className="text-center mt-8 text-indigo-900/40 font-bold text-xs uppercase tracking-widest">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
                        Login Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;

