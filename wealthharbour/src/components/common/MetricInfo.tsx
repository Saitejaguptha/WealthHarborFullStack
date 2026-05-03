import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiX, FiInfo, FiHelpCircle, FiBookOpen } from 'react-icons/fi';
import { METRIC_GLOSSARY } from '../../data/metricDefinitions';

interface MetricInfoProps {
    metricKey: string;
    /** corner: absolute top-right (default). inline-beside: compact button for same row as a value (flex with items-center). */
    position?: 'corner' | 'inline-beside';
}

const MetricInfo: React.FC<MetricInfoProps> = ({ metricKey, position = 'corner' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const definition = METRIC_GLOSSARY[metricKey];

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

    if (!definition) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-hidden">
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
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <FiBookOpen className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-indigo-950 tracking-tight leading-tight">{definition.name}</h2>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">Financial Definition</p>
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
                        <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                                    <FiInfo /> What is it?
                                </div>
                                <p className="text-indigo-900/70 text-sm leading-relaxed font-medium">
                                    {definition.description}
                                </p>
                            </section>

                            {definition.formula && (
                                <section className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                        <FiHelpCircle /> The Formula
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-center text-center">
                                        <code className="text-emerald-950 font-black text-sm md:text-base tracking-tight font-mono">
                                            {definition.formula}
                                        </code>
                                    </div>
                                </section>
                            )}

                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-4 bg-indigo-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-900 transition-all active:scale-[0.98] shadow-xl"
                            >
                                Got it, Thanks!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={
                    position === 'inline-beside'
                        ? 'shrink-0 p-1.5 bg-indigo-50 rounded-lg text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 hover:scale-105 transition-all shadow-sm border border-indigo-100/50 flex items-center justify-center'
                        : 'absolute top-2 right-2 p-2 bg-indigo-50 rounded-xl text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 hover:scale-110 transition-all z-20 shadow-sm border border-indigo-100/50 flex items-center justify-center'
                }
                title={`What is ${metricKey}?`}
            >
                <FiStar className={position === 'inline-beside' ? 'text-[10px] fill-current' : 'text-xs md:text-sm fill-current'} />
            </button>

            {createPortal(modalContent, document.body)}
        </>
    );
};

export default MetricInfo;
