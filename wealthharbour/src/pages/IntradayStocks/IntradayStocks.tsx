import React, { useState, useEffect } from 'react';
import { FiActivity, FiZap, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { IntradayService, GuideService } from '../../services/api';

interface IntradayPick {
    symbol: string;
    name: string;
    strength: string;
    signal: string;
    target: string;
    sl: string;
}

const IntradayStocks: React.FC = () => {
    const navigate = useNavigate();
    const [intradayPicks, setIntradayPicks] = useState<IntradayPick[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [guide, setGuide] = useState<any>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [picksData, guideData] = await Promise.all([
                    IntradayService.getPicks(),
                    GuideService.getGuide('intraday')
                ]);
                if (picksData) setIntradayPicks(picksData);
                if (guideData) setGuide(guideData);
            } catch (err) {
                console.error('Failed to load intraday data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const filteredPicks = intradayPicks.filter(pick => 
        pick.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pick.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Intraday Pulse"
                subtitle="Momentum-based intraday setups and technical signals."
                icon={<FiZap className="text-rose-600" />}
                guide={guide}
                guideColor="rose"
            />

            {/* Search & Intelligence Bar */}
            <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search symbols or company names..." 
                        className="w-full pl-16 pr-8 py-5 bg-white border border-indigo-50 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-indigo-950 placeholder:text-indigo-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-indigo-50 px-8 py-5 rounded-[2rem] border border-indigo-100/50">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest whitespace-nowrap">Real-time Momentum Scanner Active</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Scanning Market Velocity...</p>
                </div>
            ) : filteredPicks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 stagger-children">
                    {filteredPicks.map((pick, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-indigo-950 leading-tight tracking-tighter group-hover:text-indigo-600 transition-colors">{pick.symbol}</h3>
                                        <p className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest mt-1">{pick.name}</p>
                                    </div>
                                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${pick.strength === 'Strong' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {pick.strength}
                                    </span>
                                </div>
                                
                                <div className="bg-indigo-50/50 p-6 rounded-[2rem] mb-8 border border-indigo-50 relative overflow-hidden group-hover:bg-indigo-600 transition-colors duration-500">
                                    <div className="relative z-10">
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center group-hover:text-white/60 transition-colors">Active Signal</p>
                                        <p className="text-xl font-black text-indigo-950 text-center group-hover:text-white transition-colors">{pick.signal}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                                        <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">Target</p>
                                        <p className="text-xl font-black text-emerald-600">₹{pick.target}</p>
                                    </div>
                                    <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100/50">
                                        <p className="text-[9px] font-black text-rose-900/40 uppercase tracking-widest mb-1">Stop Loss</p>
                                        <p className="text-xl font-black text-rose-600">₹{pick.sl}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate(`/intraday-stocks/${pick.symbol}`)}
                                className="w-full py-5 bg-indigo-950 text-white font-black rounded-[2rem] hover:bg-rose-600 transition-all duration-300 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl hover:shadow-rose-200"
                            >
                                Intelligence View <FiActivity />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200 mt-12">
                    <div className="text-6xl mb-6 opacity-10">🔭</div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">No Signals Captured</h3>
                    <p className="text-indigo-900/40 font-medium mt-2">Try adjusting your search to reveal hidden opportunities</p>
                </div>
            )}
        </PageShell>
    );
};

export default IntradayStocks;

