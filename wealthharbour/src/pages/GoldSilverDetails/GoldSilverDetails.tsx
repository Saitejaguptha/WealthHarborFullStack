import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiActivity, FiLayers, FiGlobe } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';

const goldSilverDatabase: Record<string, any> = {
    'gold': {
        name: 'Gold', type: 'Precious Metal',
        price: '₹7,126.50', unit: 'per Gram', change: '+1.2%', trend: 'Bullish',
        description: 'Gold is traditionally viewed as a safe-haven asset, protecting portfolios during times of economic uncertainty and high inflation. It has a robust secondary market and strong global liquidity.',
        support: '₹7,050', resistance: '₹7,200', rsi: '68 (Bullish)', macd: 'Positive divergence'
    },
    'silver': {
        name: 'Silver', type: 'Industrial & Precious Metal',
        price: '₹84.30', unit: 'per Gram', change: '+2.1%', trend: 'Highly Bullish',
        description: 'Silver acts as both a precious metal for investment and a highly demanded industrial metal, heavily used in electronics, solar panels, and EV batteries.',
        support: '₹82', resistance: '₹87', rsi: '72 (Overbought)', macd: 'Strong upward momentum'
    }
};

const GoldSilverDetails: React.FC = () => {
    // We expect the path to be `/gold-silver/:type` where type is gold or silver
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const metal = goldSilverDatabase[id?.toLowerCase() || ''];

    if (!metal) {
        return (
            <PageShell className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Asset Not Found</h2>
                <button onClick={() => navigate('/gold-silver')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                    Back to Precious Metals
                </button>
            </PageShell>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/gold-silver')} className="p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-2 py-0.5 text-white text-[8px] md:text-[10px] font-black rounded uppercase tracking-widest shrink-0 ${id === 'gold' ? 'bg-amber-500' : 'bg-slate-500'}`}>
                                {metal.type}
                            </span>
                        </div>
                        <h1 className="text-lg md:text-3xl font-black text-indigo-950 tracking-tight leading-tight">{metal.name}</h1>
                    </div>
                </div>
                <div>
                     <button className={`w-full sm:w-auto px-6 py-3 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-100/50 uppercase tracking-widest text-xs ${id === 'gold' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-slate-500 hover:bg-slate-600 shadow-slate-500/30'}`}>
                        Start SIP
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                 <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                     <div className="relative z-10">
                         <p className="text-indigo-200/60 font-bold uppercase tracking-widest text-[10px] mb-2 flex justify-between items-center w-full">
                            <span>Market Price ({metal.unit})</span>
                            <span className="text-emerald-400 text-sm flex items-center gap-1"><FiActivity /> {metal.change}</span>
                         </p>
                         <span className={`text-4xl md:text-5xl font-black block mb-6 ${id === 'gold' ? 'text-amber-400' : 'text-slate-300'}`}>{metal.price}</span>
                         
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                             <div>
                                 <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">RSI (14)</p>
                                 <p className="font-black text-white text-lg">{metal.rsi}</p>
                             </div>
                             <div>
                                 <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">MACD</p>
                                 <p className="font-black text-white text-lg truncate" title={metal.macd}>{metal.macd}</p>
                             </div>
                             <div>
                                 <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">Support</p>
                                 <p className="font-black text-white text-lg">{metal.support}</p>
                             </div>
                             <div>
                                 <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">Resistance</p>
                                 <p className="font-black text-white text-lg">{metal.resistance}</p>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <h3 className="text-xl font-black text-indigo-950 mb-3 flex items-center gap-2"><FiGlobe className="text-indigo-500" /> Fundamental View</h3>
                            <p className="text-indigo-900/60 leading-relaxed font-medium text-sm">{metal.description}</p>
                        </div>
                        <div className="flex-1 lg:border-l lg:border-indigo-50 lg:pl-12">
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3 max-w-xs">
                                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><FiTrendingUp /></div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Market Trend</p>
                                    <p className="font-bold text-indigo-950">{metal.trend}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-indigo-50/50 border border-indigo-100 p-6 md:p-8 rounded-[2rem]">
                      <h3 className="text-lg font-black text-indigo-950 mb-4 flex items-center gap-2"><FiLayers className="text-indigo-500" /> Investment Methods</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-0 hover:px-2 transition-all">
                              <span className="font-bold text-indigo-900/60">ETFs</span>
                              <span className="font-black text-indigo-600 bg-white px-2 py-1 shadow-sm rounded-lg text-[10px] uppercase tracking-widest">Highly Liquid</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-0 hover:px-2 transition-all">
                              <span className="font-bold text-indigo-900/60">Digital</span>
                              <span className="font-black text-indigo-600 bg-white px-2 py-1 shadow-sm rounded-lg text-[10px] uppercase tracking-widest">Low Cost</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-0 hover:px-2 transition-all">
                              <span className="font-bold text-indigo-900/60">Physical</span>
                              <span className="font-black text-indigo-600 bg-white px-2 py-1 shadow-sm rounded-lg text-[10px] uppercase tracking-widest">Premium Added</span>
                          </div>
                      </div>
                 </div>
            </div>
        </PageShell>
    );
};

export default GoldSilverDetails;
