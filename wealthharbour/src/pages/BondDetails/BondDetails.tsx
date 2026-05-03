import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FiArrowLeft, FiShield, FiPercent, FiBriefcase, 
    FiTrendingUp, FiActivity, FiLayers, FiMinimize2, FiDownload, FiShoppingCart
} from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import type { AppDispatch, RootState } from '../../store';
import { fetchBondDetails, clearCurrentBond } from '../../store/slices/bondsSlice';

const BondDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentBond: bond, isLoading } = useSelector((state: RootState) => state.bonds);

    React.useEffect(() => {
        if (id) {
            dispatch(fetchBondDetails(decodeURIComponent(id)));
        }
        return () => {
            dispatch(clearCurrentBond());
        };
    }, [id, dispatch]);

    if (isLoading) {
        return (
            <PageShell className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
            </PageShell>
        );
    }

    if (!bond) {
        return (
            <PageShell className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 mb-8 shadow-inner">
                    <FiLayers size={32} />
                </div>
                <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic mb-8 text-left">Asset Not Found</h2>
                <button 
                    onClick={() => navigate('/securities-bond')} 
                    className="px-10 py-5 bg-indigo-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all shadow-xl"
                >
                    Return to Registry
                </button>
            </PageShell>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            {/* Header / Top Navigation */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="flex items-start gap-8">
                    <button 
                        onClick={() => navigate('/securities-bond')} 
                        className="p-5 bg-white border border-indigo-50 text-indigo-400 hover:bg-indigo-950 hover:text-white rounded-[1.5rem] transition-all shadow-sm active:scale-90"
                    >
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                {bond.type}
                            </span>
                            <span className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.2em]">{bond.issuer}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-indigo-950 tracking-tighter leading-none text-left">{bond.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-indigo-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 group">
                        <FiShoppingCart size={16} /> <span>Allocate Capital</span>
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-white border border-indigo-50 text-indigo-600 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiDownload size={16} /> <span>Termsheet</span>
                    </button>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="flex flex-col gap-6 mb-8 stagger-children">
                {/* Interest Rate Card */}
                <div className="bg-indigo-950 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/60 mb-4 text-left">Coupon Yield Architecture</p>
                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter font-mono group-hover:scale-105 transition-transform duration-700 block">{bond.interestRate}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 text-left">Maturity</p>
                                <p className="text-lg font-black tracking-tighter text-left">{bond.tenure}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 text-left">Frequency</p>
                                <p className="text-lg font-black tracking-tighter text-left">{bond.interestPayment}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 text-left">Credit Rating</p>
                                <p className="text-lg font-black tracking-tighter text-emerald-400 text-left">{bond.rating}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 text-left">Issue Magnitude</p>
                                <p className="text-lg font-black tracking-tighter text-left">{bond.issueSize}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Overview */}
                <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 relative z-10">
                        <div className="lg:w-1/4">
                            <h3 className="text-xl font-black text-indigo-950 tracking-tighter uppercase italic mb-3 flex items-center gap-3 text-left">
                                <FiShield className="text-emerald-500" /> Security
                            </h3>
                            <p className="text-indigo-900/60 text-sm font-medium leading-relaxed text-left">{bond.description}</p>
                        </div>
                        <div className="flex-1 lg:border-l lg:border-indigo-50 lg:pl-12">
                             <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-5 max-w-sm">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner"><FiActivity /></div>
                                <div>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-left">Tax Governance</p>
                                    <p className="font-black text-indigo-950 text-xs text-left">{bond.taxStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Ledger / Issuance Details */}
            <div className="bg-white border border-indigo-50 rounded-[4rem] p-10 md:p-16 shadow-sm relative overflow-hidden">
                <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic mb-12 flex items-center gap-4 text-left">
                    <FiLayers className="text-indigo-600" /> Structural Parameters
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiBriefcase /> Primary Issuer
                            </span>
                            <span className="font-black text-indigo-950 text-lg tracking-tighter text-right">{bond.issuer}</span>
                        </div>
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiPercent /> Unit Face Value
                            </span>
                            <span className="font-black text-indigo-950 text-lg tracking-tighter text-right">{bond.faceValue}</span>
                        </div>
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiMinimize2 /> Minimum Entry
                            </span>
                            <span className="font-black text-emerald-600 text-lg tracking-tighter text-right bg-emerald-50 px-5 py-2 rounded-2xl">{bond.minInvestment}</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiTrendingUp /> Ceiling Limit
                            </span>
                            <span className="font-black text-indigo-950 text-lg tracking-tighter text-right">{bond.maxInvestment}</span>
                        </div>
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiShield /> Asset Classification
                            </span>
                            <span className="font-black text-indigo-950 text-lg tracking-tighter text-right">{bond.type}</span>
                        </div>
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50">
                            <span className="flex items-center gap-3 text-indigo-900/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                <FiActivity /> Liquidity Node
                            </span>
                            <span className="font-black text-indigo-600 text-sm uppercase tracking-widest text-right bg-indigo-50 px-5 py-2 rounded-2xl">NSE / BSE Secondary</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-10 flex gap-6 mt-12 items-start">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 shadow-inner"><FiActivity size={20} /></div>
                <p className="text-xs text-rose-900/60 font-black uppercase tracking-widest leading-loose text-left">
                    Structural Risk Disclosure: Yield trajectories are non-linear and governed by macro-economic volatility. 
                    Sovereign assets are backed by the State treasury, while Corporate nodes carry inherent credit default risks. 
                    Perform rigorous capital allocation audits before commitment.
                </p>
            </div>
        </PageShell>
    );
};

export default BondDetails;
