import React, { useState, useEffect } from 'react';
import { FiActivity, FiTrendingUp, FiTrendingDown, FiClock, FiSearch, FiLayers } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { DerivativeService, GuideService } from '../../services/api';

const FandO: React.FC = () => {
    const [sampleOptions, setSampleOptions] = useState<any[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showGreeks, setShowGreeks] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [optionsData, guideData, summaryData] = await Promise.all([
                DerivativeService.getOptionChain(),
                GuideService.getGuide('fo'),
                DerivativeService.getDerivativesSummary()
            ]);
            if (optionsData) setSampleOptions(optionsData);
            if (guideData) setGuide(guideData);
            if (summaryData) setSummary(summaryData);
        } catch (err) {
            console.error('Failed to load F&O data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredOptions = sampleOptions.filter(opt => 
        opt.strike.toString().includes(searchTerm)
    );

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Options Chain"
                subtitle="Live derivatives data with advanced Greeks and OI analysis"
                icon={<FiActivity className="text-rose-600" />}
                guide={guide}
                guideColor="rose"
            />

            {/* Controls */}
            <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
                <div className="flex-1 relative w-full group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by Strike Price..." 
                        className="w-full pl-16 pr-8 py-5 bg-white border border-indigo-50 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setShowGreeks(!showGreeks)}
                    className={`px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all border shadow-sm flex items-center gap-2 whitespace-nowrap active:scale-95 ${showGreeks ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}
                >
                    <FiLayers />
                    {showGreeks ? 'Hide Greeks' : 'Show Greeks'}
                </button>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/30 overflow-hidden">
                <div className="p-8 border-b border-indigo-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white">
                            <FiActivity />
                        </div>
                        <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">NIFTY Option Chain</h2>
                    </div>
                    <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-indigo-900/40">
                        <div className="flex items-center gap-2">
                            <FiClock className="text-indigo-600" /> Last Updated: <span className="text-indigo-950">{summary?.lastUpdated || '...'}</span>
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-600 font-black">
                            Exp: {summary?.expiryDate || '...'}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse table-fixed min-w-[1200px]">
                        <thead>
                            <tr className="bg-indigo-50/50 text-indigo-900/40 text-[9px] font-black uppercase tracking-widest border-b border-indigo-50">
                                <th colSpan={showGreeks ? 8 : 4} className="px-6 py-5 border-r border-indigo-50 bg-emerald-50/30 text-emerald-600">CALLS</th>
                                <th className="px-6 py-5 bg-indigo-50/50 text-indigo-950 w-32">UNDERLYING</th>
                                <th colSpan={showGreeks ? 8 : 4} className="px-6 py-5 border-l border-indigo-50 bg-rose-50/30 text-rose-600">PUTS</th>
                            </tr>
                            <tr className="bg-white text-indigo-900/40 text-[8px] font-black uppercase tracking-widest border-b border-indigo-50">
                                {showGreeks && (
                                    <>
                                        <th className="px-2 py-4">Delta</th>
                                        <th className="px-2 py-4">Theta</th>
                                        <th className="px-2 py-4">Gamma</th>
                                        <th className="px-2 py-4">Vega</th>
                                    </>
                                )}
                                <th className="px-4 py-4">OI</th>
                                <th className="px-4 py-4">OI CHG</th>
                                <th className="px-4 py-4">IV</th>
                                <th className="px-4 py-4 border-r border-indigo-50">LTP</th>
                                <th className="px-6 py-4 bg-indigo-50/30 text-indigo-900 font-black">STRIKE</th>
                                <th className="px-4 py-4 border-l border-indigo-50">LTP</th>
                                <th className="px-4 py-4">IV</th>
                                <th className="px-4 py-4">OI CHG</th>
                                <th className="px-4 py-4">OI</th>
                                {showGreeks && (
                                    <>
                                        <th className="px-2 py-4">Vega</th>
                                        <th className="px-2 py-4">Gamma</th>
                                        <th className="px-2 py-4">Theta</th>
                                        <th className="px-2 py-4">Delta</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={showGreeks ? 17 : 9} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                                            <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Calculating Intrinsic Value...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOptions.map((opt, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50/20 transition-colors group text-xs font-black">
                                    {showGreeks && (
                                        <>
                                            <td className="px-2 py-5 text-indigo-400">{opt.callDelta}</td>
                                            <td className="px-2 py-5 text-rose-400">{opt.callTheta}</td>
                                            <td className="px-2 py-5 text-indigo-400">{opt.callGamma}</td>
                                            <td className="px-2 py-5 text-indigo-400">{opt.callVega}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-5 text-indigo-950">{opt.callOI}</td>
                                    <td className={`px-4 py-5 ${opt.callOIChange.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {opt.callOIChange}
                                    </td>
                                    <td className="px-4 py-5 text-indigo-400">{opt.callIV}</td>
                                    <td className="px-4 py-5 border-r border-indigo-50 text-indigo-950">₹{opt.callPrice.toFixed(2)}</td>
                                    <td className="px-6 py-5 bg-indigo-50/30 text-indigo-950 text-xl font-black group-hover:scale-110 transition-transform tabular-nums">
                                        {opt.strike}
                                    </td>
                                    <td className="px-4 py-5 border-l border-indigo-50 text-indigo-950">₹{opt.putPrice.toFixed(2)}</td>
                                    <td className="px-4 py-5 text-indigo-400">{opt.putIV}</td>
                                    <td className={`px-4 py-5 ${opt.putOIChange.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {opt.putOIChange}
                                    </td>
                                    <td className="px-4 py-5 text-indigo-950">{opt.putOI}</td>
                                    {showGreeks && (
                                        <>
                                            <td className="px-2 py-5 text-indigo-400">{opt.putVega}</td>
                                            <td className="px-2 py-5 text-indigo-400">{opt.putGamma}</td>
                                            <td className="px-2 py-5 text-rose-400">{opt.putTheta}</td>
                                            <td className="px-2 py-5 text-rose-400">{opt.putDelta}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest mb-1">Max Pain (Calls)</p>
                        <h3 className="text-2xl font-black text-emerald-950">{summary?.maxPainCalls || '...'}</h3>
                    </div>
                    <FiTrendingUp className="text-4xl text-emerald-600 opacity-20" />
                </div>
                <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-rose-900/40 text-[10px] font-black uppercase tracking-widest mb-1">Max Pain (Puts)</p>
                        <h3 className="text-2xl font-black text-rose-950">{summary?.maxPainPuts || '...'}</h3>
                    </div>
                    <FiTrendingDown className="text-4xl text-rose-600 opacity-20" />
                </div>
                <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-1">PCR (Ratio)</p>
                        <h3 className="text-2xl font-black text-indigo-950">{summary?.pcr || '...'}</h3>
                    </div>
                    <FiActivity className="text-4xl text-indigo-600 opacity-20" />
                </div>
                <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-amber-900/40 text-[10px] font-black uppercase tracking-widest mb-1">India VIX</p>
                        <h3 className="text-2xl font-black text-amber-950">{summary?.indiaVix || '...'}</h3>
                    </div>
                    <FiTrendingUp className="text-4xl text-amber-600 opacity-20" />
                </div>
            </div>
        </PageShell>
    );
};

export default FandO;
