import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiArrowRight, FiCheck, FiCpu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';

const initialState = {
    type: [] as string[],
    otherDetails: '',
    cap: [] as string[],
    timeHorizon: [] as string[]
};

interface SuggestionResult {
    type: string;
    whyBuy: string;
    reasoning: string;
    pros: string[];
    cons: string[];
}

const Suggestions: React.FC = () => {
    const location = useLocation();
    
    const [formData, setFormData] = useState(initialState);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<SuggestionResult[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Reset form data when the user navigates back to the root suggestions page
    useEffect(() => {
        setFormData(initialState);
    }, [location.pathname]);

    const typeOptions = [
        { label: 'Stocks', value: 'Stocks' },
        { label: 'Indices', value: 'Indices' },
        { label: 'IPO', value: 'IPO' },
        { label: 'ETF', value: 'ETF' },
        { label: 'MF', value: 'MF' },
        { label: 'Commodities', value: 'Commodities' },
        { label: 'F&O', value: 'F&O' },
        { label: 'Securities Bond', value: 'Securities Bond' },
        { label: 'Currency', value: 'Currency' },
        { label: 'Gold & Silver', value: 'Gold & Silver' },
        { label: 'FII DII', value: 'FII DII' },
        { label: 'REITS', value: 'REITS' },
        { label: 'Intraday', value: 'Intraday' },
        { label: 'Forecast Stats', value: 'Forecast Stats' }
    ];

    const capOptions = ['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap', 'All'];
    const timeOptions = ['Short Term (<1yr)', 'Medium Term (1-3yrs)', 'Long Term (5yr+)', 'Not decided'];

    const showTimeQuestion = formData.type.some(t => !['Intraday', 'F&O', 'Currency'].includes(t));

    const handleToggleSelect = (field: keyof typeof initialState, value: string) => {
        setFormData(prev => {
            const current = (prev[field] as string[]);
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleSubmit = async () => {
        if (formData.type.length === 0) return toast.error("Please select what you are looking for");
        if (formData.cap.length === 0) return toast.error("Please select a market cap preference");
        if (showTimeQuestion && formData.timeHorizon.length === 0) return toast.error("Please select an investment duration");

        setIsGenerating(true);
        try {
            const { SuggestionService } = await import('../../services/api');
            const data = await SuggestionService.generateSuggestions(formData);
            if (data) {
                setResults(data);
                setShowResults(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            toast.error("Failed to generate suggestions. Please try again.");
            console.error('Failed to generate suggestions:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (showResults) {
        return (
            <PageShell className="pb-32 animate-in fade-in duration-700">
                <div className="flex justify-between items-end mb-12 border-b border-indigo-50 pb-8">
                    <div>
                        <h1 className="text-5xl font-black text-indigo-950 mb-4 tracking-tighter">Portfolio Strategy</h1>
                        <p className="text-indigo-900/40 text-sm font-black uppercase tracking-widest">Expert architectural analysis of your goals</p>
                    </div>
                    <button 
                        onClick={() => setShowResults(false)}
                        className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                        Reconstruct Strategy
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-12 stagger-children">
                    {results.map((res: SuggestionResult) => (
                        <div 
                            key={res.type} 
                            className="bg-white border border-indigo-50 p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-indigo-100/30 overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            
                            <div className="flex items-center gap-8 mb-12 relative z-10">
                                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                                    <FiCheck />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">{res.type} Optimization</h2>
                                    <p className="text-indigo-600 font-black uppercase tracking-widest text-[10px] mt-2 bg-indigo-50 px-3 py-1 rounded-lg inline-block">Architecture for {formData.cap.join(', ')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-8">
                                    <div className="bg-emerald-50/50 rounded-[2rem] p-10 border border-emerald-100/50">
                                        <h3 className="text-emerald-900 font-black uppercase tracking-widest text-[10px] mb-6 border-b border-emerald-200/50 pb-4">Investment Thesis</h3>
                                        <p className="text-emerald-900/80 text-sm leading-relaxed font-medium italic">
                                            "{res.whyBuy}"
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50/50 rounded-[2rem] p-10 border border-indigo-100/50">
                                        <h3 className="text-indigo-950 font-black uppercase tracking-widest text-[10px] mb-6 border-b border-indigo-200/50 pb-4">Strategic Framework</h3>
                                        <p className="text-indigo-900/70 text-sm leading-relaxed font-medium">
                                            {res.reasoning}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white border border-indigo-50 rounded-[2rem] p-8 shadow-sm">
                                        <h3 className="text-indigo-900 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Tactical Advantages
                                        </h3>
                                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                                            {res.pros.map((pro: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <FiCheck className="text-emerald-500 mt-1 shrink-0 bg-emerald-50 p-1 rounded-md" />
                                                    <span className="text-indigo-950/70">{pro}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white border border-indigo-50 rounded-[2rem] p-8 shadow-sm">
                                        <h3 className="text-indigo-900 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Potential Constraints
                                        </h3>
                                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                                            {res.cons.map((con: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <span className="text-rose-500 font-black mt-[-2px] shrink-0 bg-rose-50 w-6 h-6 flex items-center justify-center rounded-md">×</span>
                                                    <span className="text-indigo-950/70">{con}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Strategy Wizard"
                subtitle="Your personalized portfolio strategy, generated in seconds."
                icon={<FiCpu className="text-indigo-600" />}
            />

            <div className="bg-white rounded-[3rem] shadow-2xl border border-indigo-50 overflow-hidden mt-12">
                <div className="p-10 md:p-20 space-y-20">
                    {/* Question 1 */}
                    <section className="animate-slide-up">
                        <div className="flex items-center gap-6 mb-10">
                            <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-indigo-200">01</span>
                            <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">What are you looking for?</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {typeOptions.map((opt) => {
                                const active = formData.type.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleToggleSelect('type', opt.value)}
                                        className={`py-5 px-8 rounded-2xl border-2 font-black transition-all flex items-center justify-between gap-4 text-[10px] active:scale-95 group ${
                                            active
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1'
                                                : 'border-transparent bg-indigo-50/50 text-indigo-400 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 hover:-translate-y-1'
                                        }`}
                                    >
                                        <span className="uppercase tracking-widest">{opt.label}</span>
                                        {active ? <FiCheck className="text-lg" /> : <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Question 2 */}
                    <section className={`${formData.type.length > 0 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 h-0 overflow-hidden pointer-events-none'} transition-all duration-700`}>
                        <div className="flex items-center gap-6 mb-10">
                            <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-indigo-200">02</span>
                            <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">Market cap preference</h2>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {capOptions.map((cap) => {
                                const active = formData.cap.includes(cap);
                                return (
                                    <button
                                        key={cap}
                                        onClick={() => handleToggleSelect('cap', cap)}
                                        className={`py-4 px-10 rounded-2xl border-2 font-black transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest ${
                                            active
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-1'
                                                : 'border-gray-100 bg-gray-50/50 text-indigo-400 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 hover:-translate-y-1'
                                        }`}
                                    >
                                        {cap} {active && <FiCheck className="animate-scale-in" />}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Question 3 */}
                    {showTimeQuestion && (
                        <section className={`${formData.cap.length > 0 ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 h-0 overflow-hidden pointer-events-none'} transition-all duration-700`}>
                            <div className="flex items-center gap-6 mb-10">
                                <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-indigo-200">03</span>
                                <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">Investment duration</h2>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {timeOptions.map((time) => {
                                    const active = formData.timeHorizon.includes(time);
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleToggleSelect('timeHorizon', time)}
                                            className={`py-4 px-10 rounded-2xl border-2 font-black transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest ${
                                                active
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-1'
                                                    : 'border-gray-100 bg-gray-50/50 text-indigo-400 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 hover:-translate-y-1'
                                            }`}
                                        >
                                            {time} {active && <FiCheck className="animate-scale-in" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Submit Button */}
                    <div className="pt-12 border-t border-indigo-50">
                        <button
                            onClick={handleSubmit}
                            disabled={formData.type.length === 0 || isGenerating}
                            className={`w-full sm:w-auto px-16 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 group shadow-2xl relative overflow-hidden ${
                                formData.type.length > 0 && !isGenerating
                                    ? 'bg-indigo-950 text-white hover:bg-indigo-900 transform hover:-translate-y-1' 
                                    : 'bg-indigo-50 text-indigo-200 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {isGenerating ? (
                                <>
                                    <span>Synthesizing...</span>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-400 border-t-white"></div>
                                </>
                            ) : (
                                <>
                                    <span>Construct Strategy</span>
                                    <FiArrowRight className="group-hover:translate-x-2 transition-transform text-xl" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16 flex items-center gap-3 text-indigo-900/20 font-black text-[10px] uppercase tracking-[0.2em] justify-center">
                <FiHelpCircle className="text-indigo-400" /> Real-Time Portfolio Intelligence Active
            </div>
        </PageShell>
    );
};

export default Suggestions;
