import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiBookOpen, FiHelpCircle } from 'react-icons/fi';

interface MetricExplainerProps {
    metric: string;
    children: React.ReactNode;
}

const METRIC_DATA: Record<string, { title: string; definition: string; formula: string; why: string }> = {
    'P/E Ratio': {
        title: 'Price to Earnings Ratio',
        definition: 'The P/E ratio relates a company\'s share price to its earnings per share. It indicates how much investors are willing to pay for every ₹1 of earnings.',
        formula: 'P/E Ratio = Market Price per Share / Earnings per Share (EPS)',
        why: 'A high P/E might mean a stock is overvalued or that investors expect high growth. A low P/E could indicate undervaluation or poor prospects.'
    },
    'P/B Ratio': {
        title: 'Price to Book Ratio',
        definition: 'Compares a firm\'s market capitalization to its book value. It reveals how much investors are paying for the net assets of the company.',
        formula: 'P/B Ratio = Market Price per Share / Book Value per Share',
        why: 'Useful for valuing banks and financial institutions. Typically, a P/B below 1 indicates the stock is trading for less than its asset value.'
    },
    'ROE': {
        title: 'Return on Equity',
        definition: 'Measures a corporation\'s profitability by revealing how much profit a company generates with the money shareholders have invested.',
        formula: 'ROE = (Net Income / Shareholders\' Equity) × 100',
        why: 'It shows how efficiently the management is using the shareholders\' capital to generate growth.'
    },
    'Debt to Equity': {
        title: 'Debt to Equity Ratio',
        definition: 'Used to gauge a company\'s financial leverage. It indicates the proportion of equity and debt used to finance a company\'s assets.',
        formula: 'D/E Ratio = Total Liabilities / Total Shareholders\' Equity',
        why: 'A high ratio suggests high risk as the company is aggressively financing growth with debt.'
    },
    'Standard Deviation': {
        title: 'Standard Deviation (Volatility)',
        definition: 'In finance, standard deviation represents the volatility or risk associated with an investment\'s returns over a period of time.',
        formula: 'σ = √[ Σ(xi - μ)² / N ]',
        why: 'Higher standard deviation means higher volatility. For mutual funds, it shows how much the return deviates from its average.'
    },
    'Beta': {
        title: 'Beta',
        definition: 'Measures the sensitivity of a stock or fund relative to the overall market (usually Nifty 50).',
        formula: 'Beta = Covariance(Asset, Market) / Variance(Market)',
        why: 'A beta of 1 means it moves with the market. >1 means it\'s more volatile than the market; <1 means it\'s more stable.'
    },
    'Sharpe Ratio': {
        title: 'Sharpe Ratio',
        definition: 'Measures the risk-adjusted return of an investment. It tells you how much excess return you receive for the extra volatility you endure.',
        formula: 'Sharpe Ratio = (Return of Portfolio - Risk-Free Rate) / Standard Deviation',
        why: 'Higher Sharpe ratio is better. It indicates that the fund\'s returns are due to smart investment decisions rather than just taking excess risk.'
    },
    'Alpha': {
        title: 'Alpha',
        definition: 'Represents the excess return of an investment relative to the return of a benchmark index.',
        formula: 'Alpha = Actual Return - [Risk-Free Rate + Beta × (Market Return - Risk-Free Rate)]',
        why: 'Positive alpha means the fund manager has outperformed the market benchmark after adjusting for risk.'
    },
    'Market Cap': {
        title: 'Market Capitalization',
        definition: 'The total market value of a company\'s outstanding shares of stock.',
        formula: 'Market Cap = Current Share Price × Total Number of Outstanding Shares',
        why: 'Used to classify companies into Large-cap, Mid-cap, and Small-cap categories.'
    },
    'Dividend Yield': {
        title: 'Dividend Yield',
        definition: 'A financial ratio that tells you the percentage of a company\'s share price that it pays out as dividends each year.',
        formula: 'Dividend Yield = (Annual Dividend per Share / Market Price per Share) × 100',
        why: 'High dividend yield stocks are often preferred by income-seeking investors (like retirees).'
    }
};

const MetricExplainer: React.FC<MetricExplainerProps> = ({ metric, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const data = METRIC_DATA[metric];

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

    if (!data) return <>{children}</>;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xl"
                    />

                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-8 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                                    <FiBookOpen className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-indigo-950 tracking-tight">{data.title}</h2>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">Knowledge Base</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-3 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                                    <FiInfo /> What is it?
                                </div>
                                <p className="text-indigo-900/70 text-sm leading-relaxed font-medium">
                                    {data.definition}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                    <FiHelpCircle /> The Formula
                                </div>
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-center text-center">
                                    <code className="text-emerald-950 font-black text-sm md:text-base tracking-tight">
                                        {data.formula}
                                    </code>
                                </div>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
                                    <FiHelpCircle /> Why it matters?
                                </div>
                                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 italic text-amber-900/70 text-xs leading-relaxed">
                                    {data.why}
                                </div>
                            </section>

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
            <div 
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-1.5 cursor-pointer group hover:text-indigo-600 transition-all"
            >
                {children}
                <FiHelpCircle className="text-indigo-300 group-hover:text-indigo-600 transition-colors" size={14} />
            </div>
            {createPortal(modalContent, document.body)}
        </>
    );
};

export default MetricExplainer;
