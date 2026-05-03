import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiX, FiCheckCircle, FiInfo, FiLayers } from 'react-icons/fi';

interface Step {
    title: string;
    description: string;
}

interface BeginnerGuideProps {
    title: string;
    description: string;
    steps: Step[];
    color?: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const BeginnerGuide: React.FC<BeginnerGuideProps> = ({ title, description, steps, color = 'indigo' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Stop scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const colorClasses = {
        indigo: 'bg-indigo-600 text-white shadow-indigo-100',
        rose: 'bg-rose-600 text-white shadow-rose-100',
        emerald: 'bg-emerald-600 text-white shadow-emerald-100',
        amber: 'bg-amber-600 text-white shadow-amber-100'
    };

    const textColorClasses = {
        indigo: 'text-indigo-600',
        rose: 'text-rose-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600'
    };

    const lightBgClasses = {
        indigo: 'bg-indigo-50',
        rose: 'bg-rose-50',
        emerald: 'bg-emerald-50',
        amber: 'bg-amber-50'
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    {/* Backdrop with Blur */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className={`p-8 border-b border-indigo-50 flex items-center justify-between ${lightBgClasses[color]}/30`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${colorClasses[color]}`}>
                                    <FiBookOpen className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-indigo-950 tracking-tight">Guide to {title}</h2>
                                    <p className={`text-[10px] uppercase tracking-widest font-bold ${textColorClasses[color]}`}>Learning Module</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-3 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
                            <section className="space-y-4">
                                <div className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest ${textColorClasses[color]}`}>
                                    <FiInfo /> Overview
                                </div>
                                <p className="text-indigo-900/70 text-lg leading-relaxed font-medium">
                                    {description}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <div className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest ${textColorClasses[color]}`}>
                                    <FiLayers /> Step-by-Step Implementation
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className={`${lightBgClasses[color]} p-6 rounded-[2rem] border border-transparent hover:border-indigo-100 transition-all group`}>
                                            <div className="flex items-start gap-4">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${colorClasses[color]}`}>
                                                    {idx + 1}
                                                </span>
                                                <div className="space-y-2">
                                                    <h4 className="font-black text-indigo-950 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                                        {step.title}
                                                    </h4>
                                                    <p className="text-indigo-900/50 text-xs leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="bg-indigo-950 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <FiCheckCircle className="text-2xl text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg">Ready to start?</h4>
                                        <p className="text-white/60 text-xs font-medium">You've unlocked the basics of {title}.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full md:w-auto px-10 py-4 bg-white text-indigo-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Got it, Thanks!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 hover:shadow-lg ${colorClasses[color]}`}
            >
                <FiBookOpen className="text-sm" />
                Beginner's Guide
            </button>

            {createPortal(modalContent, document.body)}
        </>
    );
};

export default BeginnerGuide;
