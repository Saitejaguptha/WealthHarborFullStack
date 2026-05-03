import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-indigo-50/30 text-center animate-fade-in overflow-hidden">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 transform -translate-y-4 animate-pulse-slow"></div>
                <div className="relative h-32 w-32 md:h-48 md:w-48 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-indigo-100/50 transform rotate-3 hover:rotate-0 transition-all duration-700 group">
                    <FiAlertTriangle className="h-16 w-16 md:h-24 md:w-24 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-indigo-900/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none tracking-tighter">
                404
            </h1>

            <div className="relative z-10 max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4 tracking-tight">
                    Lost in the <span className="text-indigo-600">Harbor?</span>
                </h2>
                <p className="text-indigo-900/60 text-lg mb-10 leading-relaxed">
                    The page you're looking for seems to have drifted away or never set sail. Let's get you back to familiar waters.
                </p>

                <button
                    onClick={() => navigate('/stocks')}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                >
                    <FiHome className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Take me to Safety</span>
                    <div className="absolute -inset-1 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>

            <div className="mt-20 flex gap-8 items-center opacity-30">
                <div className="h-px w-20 bg-indigo-200"></div>
                <div className="text-xs font-bold text-indigo-900 tracking-[0.3em] uppercase">WealthHarbor Navigation</div>
                <div className="h-px w-20 bg-indigo-200"></div>
            </div>
        </div>
    );
};

export default ErrorPage;

