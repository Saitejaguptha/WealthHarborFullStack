import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheck, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { useAppDispatch } from '../../store/hooks';
import { setQuizDataAction, setTopAssetsAction } from '../../store/slices/preferencesSlice';
import toast from 'react-hot-toast';

interface QuizForm {
    assetClass: string;
    marketCap?: string;
    sector?: string;
    riskTolerance: string;
    timeHorizon: string;
}

const StrategyWizard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { control, handleSubmit, watch } = useForm<QuizForm>({
        defaultValues: {
            assetClass: '',
            marketCap: '',
            sector: '',
            riskTolerance: 'Moderate',
            timeHorizon: 'Mid Term'
        }
    });

    const assetClass = watch('assetClass');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const assetOptions = [
        { label: 'Stocks', value: 'Stocks' },
        { label: 'Mutual Fund', value: 'Mutual Fund' },
        { label: 'IPO', value: 'IPO' },
        { label: 'Indices', value: 'Indices' },
        { label: 'Intraday', value: 'Intraday' },
        { label: 'F&O', value: 'F&O' },
        { label: 'Currency', value: 'Currency' },
        { label: 'Commodities', value: 'Commodities' },
        { label: 'Gold & Silver', value: 'Gold & Silver' },
        { label: 'Bonds', value: 'Bonds' },
        { label: 'REITs', value: 'REITs' },
        { label: 'FII/DII', value: 'FII/DII' },
        { label: 'Indian Forecast', value: 'Indian Forecast' }
    ];

    const capOptions = ['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'];
    const sectorOptions = ['Technology', 'Banking', 'Energy', 'Healthcare', 'Automobile', 'Consumer Goods'];

    const onSubmit = async (data: QuizForm) => {
        setIsSubmitting(true);
        try {
            // Simulate AI analysis
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Store quiz data in global state
            dispatch(setQuizDataAction(data));
            
            // Logic for dynamic sidebar (top 3)
            // If they chose Stocks, Mutual Fund, IPO, those should be top 3
            const selectedAsset = data.assetClass;
            const top3 = [selectedAsset, 'Indices', 'Indian Forecast'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
            dispatch(setTopAssetsAction(top3));

            toast.success("Strategy synthesized successfully!");

            // Navigation Engine Logic
            if (data.assetClass === 'Stocks') {
                const params = new URLSearchParams();
                if (data.marketCap) params.append('cap', data.marketCap.toLowerCase().replace(' ', ''));
                if (data.sector) params.append('sector', data.sector.toLowerCase());
                navigate(`/stocks?${params.toString()}`);
            } else if (data.assetClass === 'Mutual Fund') {
                navigate('/mutual-funds');
            } else {
                // Fallback for "No Match" or other assets
                navigate('/forecast');
            }
        } catch (error) {
            toast.error("Failed to generate strategy.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageShell className="pb-32">
            <PageHeader 
                title="Strategy Wizard"
                subtitle="Personalized portfolio architecture powered by AI."
                icon={<FiCpu className="text-indigo-600" />}
            />

            <div className="bg-white rounded-[3rem] shadow-2xl border border-indigo-50 overflow-hidden mt-12 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="p-10 md:p-20 space-y-12">
                    
                    {/* Question 1: Asset Class */}
                    <section>
                        <div className="flex items-center gap-6 mb-8">
                            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100">01</span>
                            <h2 className="text-2xl font-black text-indigo-950 tracking-tighter">What are you looking for?</h2>
                        </div>
                        <Controller
                            name="assetClass"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {assetOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => field.onChange(opt.value)}
                                            className={`py-4 px-6 rounded-2xl border-2 font-black transition-all flex items-center justify-between gap-3 text-[10px] uppercase tracking-widest ${
                                                field.value === opt.value
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1'
                                                    : 'border-transparent bg-indigo-50/50 text-indigo-400 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 hover:-translate-y-1'
                                            }`}
                                        >
                                            {opt.label}
                                            {field.value === opt.value && <FiCheck className="text-lg" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </section>

                    {/* Branching Logic for Stocks */}
                    <AnimatePresence mode="popLayout">
                        {assetClass === 'Stocks' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-12 overflow-hidden"
                            >
                                <div className="h-px bg-indigo-50 w-full" />
                                
                                {/* Market Cap */}
                                <section>
                                    <div className="flex items-center gap-6 mb-8">
                                        <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100">02</span>
                                        <h2 className="text-2xl font-black text-indigo-950 tracking-tighter">Preferred Market Cap</h2>
                                    </div>
                                    <Controller
                                        name="marketCap"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex flex-wrap gap-3">
                                                {capOptions.map((cap) => (
                                                    <button
                                                        key={cap}
                                                        type="button"
                                                        onClick={() => field.onChange(cap)}
                                                        className={`py-3 px-8 rounded-xl border-2 font-black transition-all text-[10px] uppercase tracking-widest ${
                                                            field.value === cap
                                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                                : 'border-gray-100 bg-gray-50/50 text-indigo-400 hover:bg-white hover:text-indigo-600'
                                                        }`}
                                                    >
                                                        {cap}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </section>

                                {/* Sector */}
                                <section>
                                    <div className="flex items-center gap-6 mb-8">
                                        <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100">03</span>
                                        <h2 className="text-2xl font-black text-indigo-950 tracking-tighter">Target Sector</h2>
                                    </div>
                                    <Controller
                                        name="sector"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {sectorOptions.map((sector) => (
                                                    <button
                                                        key={sector}
                                                        type="button"
                                                        onClick={() => field.onChange(sector)}
                                                        className={`py-3 px-6 rounded-xl border-2 font-black transition-all text-[10px] uppercase tracking-widest ${
                                                            field.value === sector
                                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                                : 'border-gray-100 bg-gray-50/50 text-indigo-400 hover:bg-white hover:text-indigo-600'
                                                        }`}
                                                    >
                                                        {sector}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="pt-12 border-t border-indigo-50">
                        <button
                            type="submit"
                            disabled={!assetClass || isSubmitting}
                            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 group shadow-2xl relative overflow-hidden ${
                                assetClass && !isSubmitting
                                    ? 'bg-indigo-950 text-white hover:bg-indigo-900 transform hover:-translate-y-1' 
                                    : 'bg-indigo-50 text-indigo-200 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {isSubmitting ? (
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
                </form>
            </div>

            <div className="mt-16 flex items-center gap-3 text-indigo-900/20 font-black text-[10px] uppercase tracking-[0.2em] justify-center">
                <FiHelpCircle className="text-indigo-400" /> Real-Time Portfolio Intelligence Active
            </div>
        </PageShell>
    );
};

export default StrategyWizard;
