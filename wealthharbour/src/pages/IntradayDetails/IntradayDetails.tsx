import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiZap, FiTarget, FiActivity } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';

const intradayDatabase: Record<string, any> = {
    'HDFCBANK': {
        symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,445.20', signal: 'Buy Above 1450', target: '1465', sl: '1435', strength: 'Strong',
        rationale: 'Stock has formed a bullish flag pattern on the 15-minute timeframe. A breakout above 1450 resistance accompanied by volume expansion suggests a quick move towards 1465.',
        indicators: { rsi: '62 (Bullish)', macd: 'Bullish Crossover', volume: '1.5x Avg' }
    },
    'RELIANCE': {
        symbol: 'RELIANCE', name: 'Reliance Ind.', price: '₹2,980.50', signal: 'Sell Below 2975', target: '2950', sl: '3000', strength: 'Moderate',
        rationale: 'Rejection from psychological resistance at 3000. Double top formation on intraday charts suggests a breakdown below the neckline (2975) could trigger selling pressure.',
        indicators: { rsi: '45 (Bearish)', macd: 'Bearish Divergence', volume: 'Average' }
    },
    'INFY': {
        symbol: 'INFY', name: 'Infosys', price: '₹1,560.10', signal: 'Buy Near 1555', target: '1580', sl: '1545', strength: 'Strong',
        rationale: 'Strong IT sector momentum globally. Stock is finding strong support near the 20-EMA on 5-minute charts. Buying the dip near 1555 offers an excellent risk-to-reward ratio.',
        indicators: { rsi: '55 (Neutral to Bullish)', macd: 'Trending Up', volume: 'High' }
    }
};

const IntradayDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const pick = intradayDatabase[id || ''];

    if (!pick) {
        return (
            <PageShell className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Trade Setup Not Found</h2>
                <button onClick={() => navigate('/intraday-stocks')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                    Back to Intraday
                </button>
            </PageShell>
        );
    }

    const isBuy = pick.signal.includes('Buy');

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/intraday-stocks')} className="p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-white text-[8px] md:text-[10px] font-black rounded uppercase tracking-widest shrink-0 ${isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {isBuy ? 'LONG TRADE' : 'SHORT TRADE'}
                            </span>
                        </div>
                        <h1 className="text-lg md:text-3xl font-black text-indigo-950 tracking-tight leading-tight">{pick.symbol} <span className="text-indigo-900/40 text-sm">{pick.name}</span></h1>
                    </div>
                </div>
                <div>
                     <span className="text-3xl font-black text-indigo-950 block text-right">{pick.price}</span>
                     <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block text-right">Current Market Price</span>
                </div>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                 <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                     <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2"><FiZap className={isBuy ? 'text-emerald-500' : 'text-rose-500'} /> Execution Setup</h2>
                     <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex-1 bg-indigo-950 p-6 rounded-2xl">
                             <p className="text-indigo-200/50 text-[10px] font-black uppercase tracking-widest mb-1">Action Trigger</p>
                             <p className="text-2xl md:text-3xl font-black text-white">{pick.signal}</p>
                         </div>
                         <div className="flex-1 grid grid-cols-2 gap-4">
                             <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100/50">
                                 <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><FiTarget /> Target Price</p>
                                 <p className="text-xl font-black text-emerald-600">₹{pick.target}</p>
                             </div>
                             <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100/50">
                                 <p className="text-rose-900/40 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><FiActivity /> Stop Loss</p>
                                 <p className="text-xl font-black text-rose-600">₹{pick.sl}</p>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="bg-indigo-50/50 border border-indigo-100 p-6 md:p-8 rounded-[2.5rem]">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="shrink-0">
                            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2"><FiActivity className="text-indigo-400" /> Technicals</h3>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 text-center">
                                <span className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">RSI</span>
                                <span className="font-bold text-indigo-950 text-sm">{pick.indicators.rsi}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 text-center">
                                <span className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">MACD</span>
                                <span className="font-bold text-indigo-950 text-sm">{pick.indicators.macd}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 text-center">
                                <span className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">Volume</span>
                                <span className="font-bold text-indigo-950 text-sm">{pick.indicators.volume}</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>


            <div className="bg-white border text-indigo-900 border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                 <h3 className="text-xl font-black mb-4">Trade Rationale</h3>
                 <p className="font-medium leading-relaxed opacity-70">{pick.rationale}</p>
            </div>
        </PageShell>
    );
};

export default IntradayDetails;
