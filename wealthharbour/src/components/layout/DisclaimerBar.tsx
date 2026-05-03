import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle, FiInfo, FiShield } from 'react-icons/fi';

const DisclaimerBar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Stop scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const modalContent = (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    {/* Backdrop with Blur */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <FiShield className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-indigo-950 tracking-tight">Full Disclaimer</h2>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">Legal & Statutory Guidelines</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-3 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-rose-500 font-black text-xs uppercase tracking-widest">
                                    <FiAlertTriangle /> Market Risk Disclosure
                                </div>
                                <p className="text-indigo-900/70 text-sm leading-relaxed">
                                    Investments in securities market are subject to market risks. Read all the related documents carefully before investing.
                                    The securities quoted are for illustration only and are not recommendatory.
                                    Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                    <FiInfo /> Advisory Status
                                </div>
                                <p className="text-indigo-900/70 text-sm leading-relaxed">
                                    WealthHarbor (this application) is a platform for educational and research purposes.
                                    We are not a SEBI registered investment advisor. Any strategy, analysis, or recommendation provided within this app
                                    should be discussed with your certified financial planner or investment advisor before execution.
                                </p>
                            </section>

                            <div className="bg-indigo-50 rounded-3xl p-6 space-y-4">
                                <h4 className="font-black text-indigo-950 text-sm">Terms of Use</h4>
                                <ul className="text-indigo-900/60 text-xs space-y-2 list-disc pl-4 leading-relaxed">
                                    <li>Past performance is not indicative of future results.</li>
                                    <li>Data presented might be delayed by 15-20 minutes depending on the exchange feed.</li>
                                    <li>WealthHarbor is not liable for any financial losses incurred based on the data provided.</li>
                                    <li>Always verify data with official exchange websites (NSE/BSE).</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-[30px] bg-indigo-950 text-white flex items-center z-[50] border-b border-white/10">
                <div className="flex items-center gap-2 px-4 shrink-0 bg-indigo-950 z-10 h-full">
                    <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-[4px] text-[8px] uppercase tracking-tighter font-black">Statutory</span>
                </div>
                
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    <div className="whitespace-nowrap animate-marquee flex items-center gap-4 text-[10px] md:text-xs font-bold px-4">
                        <span className="opacity-90">Investments are subject to market risks. Read all scheme documents carefully.</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="underline hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
                        >
                            [View Full Disclaimer]
                        </button>
                        {/* Duplicate for seamless loop on small screens */}
                        <span className="opacity-90 md:hidden">Investments are subject to market risks. Read all scheme documents carefully.</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="underline hover:text-indigo-300 transition-colors cursor-pointer shrink-0 md:hidden"
                        >
                            [View Full Disclaimer]
                        </button>
                    </div>
                </div>
            </div>

            {createPortal(modalContent, document.body)}
        </>
    );

};

export default DisclaimerBar;
