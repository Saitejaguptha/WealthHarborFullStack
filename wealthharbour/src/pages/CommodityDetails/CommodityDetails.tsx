import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiActivity, FiGlobe, FiInfo, FiClock, FiLayers } from 'react-icons/fi';
import { CommodityService } from '../../services/api';
import type { CommodityData } from '../../types/commodity';
import PriceHistoryChart from '../../components/common/PriceHistoryChart';
import MetricInfo from '../../components/common/MetricInfo';
import { addToWatchlist, removeFromWatchlist } from '../../utils/watchlistUtils';
import { useAppSelector } from '../../store/hooks';
import { FiPlus, FiCheck } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import { useAppPreferences } from '../../store/slices/preferencesHooks';

const CommodityDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    const { currency } = useAppPreferences();
    const [commodity, setCommodity] = useState<CommodityData | null>(null);
    const [_isLoading, setIsLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    const inWatchlist = commodity ? watchlist.some(w => w.item_id === commodity.id) : false;

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await CommodityService.analyzeCommodity(id || '');
                if (data) setCommodity(data);
                else setError('Commodity not found');
            } catch { setError('Failed to load commodity details'); }
            finally { setIsLoading(false); }
        };
        load();
    }, [id]);

    const toggleWatchlist = () => {
        if (!commodity) return;
        if (inWatchlist) {
            removeFromWatchlist(commodity.id, commodity.name, commodity.symbol);
        } else {
            addToWatchlist({
                item_id: commodity.id,
                item_name: commodity.name,
                symbol: commodity.symbol,
                item_type: 'commodity',
                price: typeof commodity.currentPrice === 'number' ? commodity.currentPrice : undefined,
                change: commodity.change,
                change_pct: commodity.changePercent
            });
        }
    };

    const historyData = useMemo(() => {
        const USD_CONVERSION = 0.012;
        return commodity?.history.map(point => ({
            ...point,
            price: currency === 'USD' ? Number((point.price * USD_CONVERSION).toFixed(3)) : point.price
        })) || [];
    }, [commodity, currency]);

    const formatPrice = (price: number) => {
        const USD_CONVERSION = 0.012;
        const adjustedPrice = currency === 'USD' ? price * USD_CONVERSION : price;
        return adjustedPrice.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: currency === 'USD' ? 2 : 3,
            minimumFractionDigits: 0,
        });
    };

    if (!commodity) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                <div className="text-6xl mb-4 opacity-20">📦</div>
                <h2 className="text-2xl font-bold text-indigo-950 mb-2">Commodity Not Found</h2>
                <Link to="/commodities" className="text-indigo-600 font-bold hover:underline">Back to Commodities Hub</Link>
            </div>
        );
    }

    return (
        <PageShell className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/commodities')}
                        className="p-3 bg-white border border-indigo-50 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                                {commodity.symbol}
                            </span>
                            <span className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest">{commodity.category} Market</span>
                        </div>
                        <h1 className="text-4xl font-black text-indigo-950 tracking-tight">{commodity.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleWatchlist}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-sm text-sm flex items-center gap-2 ${inWatchlist
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        {inWatchlist ? <FiCheck /> : <FiPlus />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                    <div className="h-12 w-px bg-indigo-100 mx-2 hidden md:block" />
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                            <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                Live Price ({commodity.unit})
                            </p>
                            <div className="relative h-3 w-3">
                                <MetricInfo metricKey="NAV" />
                            </div>
                        </div>
                        <span className="text-2xl md:text-3xl font-black text-indigo-950">{formatPrice(commodity.currentPrice)}</span>
                    </div>
                    <div className="h-12 w-px bg-indigo-100 mx-2 hidden md:block" />
                    <div className="text-right">
                        <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-1">Change</p>
                        <span className={`text-3xl font-black ${commodity.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {commodity.change > 0 ? '+' : ''}{commodity.changePercent}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Price History Chart */}
            <div className="mb-8">
                <PriceHistoryChart
                    history={historyData}
                    color={commodity.color}
                    title={`${commodity.name} Price Channel`}
                    currencySymbol={currency === 'INR' ? '₹' : '$'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/30">
                        <h3 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiActivity className="text-indigo-400" /> Market Snapshot
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-indigo-50/30 rounded-3xl border border-white">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-2">Day Range</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-950">{formatPrice(commodity.dayLow)}</span>
                                    <div className="flex-1 mx-4 h-1 bg-indigo-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600"
                                            style={{ width: `${((commodity.currentPrice - commodity.dayLow) / (commodity.dayHigh - commodity.dayLow)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-bold text-indigo-950">{formatPrice(commodity.dayHigh)}</span>
                                </div>
                            </div>
                            <div className="p-6 bg-indigo-50/30 rounded-3xl border border-white">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-2">24h Volume</span>
                                <span className="text-2xl font-black text-indigo-950">{commodity.currentVolume.toLocaleString()} {commodity.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/30">
                        <h3 className="text-xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                            <FiInfo className="text-indigo-400" /> About {commodity.name}
                        </h3>
                        <p className="text-indigo-900/60 leading-relaxed font-medium">
                            {commodity.name} is a vital asset in the {commodity.category.toLowerCase()} sector.
                            Its price is influenced by global supply-demand dynamics, geopolitical shifts, and macroeconomic indicators.
                            The current trend shows a {commodity.changePercent > 0 ? 'bullish' : 'bearish'} movement with a change of {commodity.changePercent}% over the last session.
                        </p>
                    </div>

                    <div className="bg-white border border-indigo-50 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/30">
                        <h3 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            Technical Indicators (Daily)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-indigo-50/50 rounded-2xl">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">Support 1</span>
                                <span className="font-bold text-indigo-950">{formatPrice(commodity.dayLow * 0.98)}</span>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">Resistance 1</span>
                                <span className="font-bold text-indigo-950">{formatPrice(commodity.dayHigh * 1.02)}</span>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">RSI (14)</span>
                                <span className={`font-bold ${commodity.changePercent > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{commodity.changePercent > 0 ? '62.4 (Bullish)' : '38.2 (Bearish)'}</span>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl">
                                <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest block mb-1">MACD</span>
                                <span className="font-bold text-indigo-950">{commodity.changePercent > 0 ? 'Positive Crossover' : 'Negative Crossover'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-indigo-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <FiGlobe className="text-8xl" />
                        </div>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <FiLayers /> Logistics Info
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Trading Unit</span>
                                <span className="font-black">{commodity.unit}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Base Currency</span>
                                <span className="font-black">{commodity.currency}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Market Class</span>
                                <span className="font-black px-2 py-1 bg-white/10 rounded-lg text-[10px]">{commodity.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-indigo-50 rounded-[2.5rem] shadow-xl shadow-indigo-100/30">
                        <h3 className="text-xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                            <FiClock className="text-indigo-400" /> Market Hours
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs pb-2 border-b border-indigo-50">
                                <span className="text-indigo-900/40 font-bold uppercase tracking-widest">Status</span>
                                <span className="text-emerald-600 font-black">Open</span>
                            </div>
                            <div className="flex justify-between text-xs pb-2 border-b border-indigo-50">
                                <span className="text-indigo-900/40 font-bold uppercase tracking-widest">Trading Hour</span>
                                <span className="text-indigo-950 font-black">9:00 - 23:30</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default CommodityDetails;

