import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error('Please enter your email');
        
        // Simulate backend call
        setIsSubmitted(true);
        toast.success('Recovery link sent to your email!');
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 flex items-center justify-center">
            <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-500 overflow-y-auto relative">
                <Link to="/login" className="absolute left-8 top-8 text-indigo-300 hover:text-indigo-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <FiArrowLeft /> Back to Login
                </Link>

                <div className="text-center mb-10 w-full max-w-sm">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl shadow-indigo-100">
                        <FiShield />
                    </div>
                    <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Recover Account</h1>
                    <p className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest mt-2">Reset your secure password</p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
                        <div className="space-y-2">
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-indigo-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-indigo-900/30 font-bold px-2">
                                We'll send a secure one-time recovery link to this address.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                            Send Recovery Link <FiArrowRight />
                        </button>
                    </form>
                ) : (
                    <div className="text-center w-full max-w-sm bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 animate-slide-up">
                        <div className="text-4xl mb-4">📧</div>
                        <h3 className="text-xl font-black text-indigo-950 mb-2">Check Your Email</h3>
                        <p className="text-indigo-900/50 text-sm font-medium leading-relaxed">
                            We've sent a recovery link to <span className="text-indigo-600 font-bold">{email}</span>. Click the link in the email to reset your password.
                        </p>
                        <button 
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-600 transition-all"
                        >
                            Didn't receive? Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
