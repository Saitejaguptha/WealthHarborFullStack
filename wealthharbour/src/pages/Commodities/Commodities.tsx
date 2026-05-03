import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommodityService } from '../../services/api';
import type { CommodityData } from '../../types/commodity';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiGlobe, FiStar } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { useAppPreferences } from '../../store/slices/preferencesHooks';
import { useAppSelector } from '../../store/hooks';
import { addToWatchlist, removeFromWatchlist } from '../../utils/watchlistUtils';

const Commodities: React.FC = () => {
    const navigate = useNavigate();
    const { currency } = useAppPreferences();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [commodities, setCommodities] = useState<CommodityData[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGuide = async () => {
            const { GuideService } = await import('../../services/api');
            const data = await GuideService.getGuide('commodities');
            if (data) setGuide(data);
        };
        loadGuide();
    }, []);

    const loadCommodities = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await CommodityService.getCommodities();
            setCommodities(data);
        } catch {
            setError('Failed to load commodities.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadCommodities(); }, []);

    const categories = ['All', 'Metals', 'Energy', 'Utilities'];
    const USD_CONVERSION = 0.012; // 1 INR = 0.012 USD

    const filteredCommodities = useMemo(() => {
        return commodities.filter(c => {
            if (c.name.toLowerCase().includes('gold') || c.name.toLowerCase().includes('silver')) return false;
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.symbol.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, commodities]);

    const formatPrice = (price: number) => {
        const adjustedPrice = currency === 'USD' ? price * USD_CONVERSION : price;
        return adjustedPrice.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: currency === 'USD' ? 2 : 3,
            minimumFractionDigits: 0,
        });
    };

    const Sparkline = ({ history, color }: { history: any[], color: string }) => {
        const prices = history.map(h => h.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        const [width, setWidth] = useState(window.innerWidth < 640 ? 80 : 120);
        const height = 30;

        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth < 380 ? 60 : window.innerWidth < 640 ? 80 : 120);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        const points = history.map((h, i) => {
            const x = (i / (history.length - 1)) * width;
            const y = height - ((h.price - min) / (range || 1)) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible">
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                />
            </svg>
        );
    };

    return (
        <PageShell className="pb-24 lg:pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Commodities Market"
                subtitle="Monitor global energy, metals, and utility markets"
                icon={<FiGlobe className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search commodities (e.g. Oil, Copper)..."
                filters={[
                    { label: 'Category', value: selectedCategory, icon: <FiActivity />, options: categories }
                ]}
                onFilterChange={(_, value) => setSelectedCategory(value)}
                currentFilters={{ 'Category': selectedCategory }}
            />
            
            <div className="mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Fetching Global Rates...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{error}</h3>
                    </div>
                ) : filteredCommodities.length > 0 ? (
                    filteredCommodities.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/30 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 group relative flex flex-col justify-between overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                                <FiGlobe className="text-8xl" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg tracking-widest uppercase shadow-sm">
                                                {item.symbol}
                                            </span>
                                            <span className="text-[9px] font-bold text-indigo-900/40 uppercase tracking-widest">{item.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-indigo-950 leading-tight">{item.name}</h3>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className={`flex items-center justify-end gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${item.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                            } mb-1`}>
                                            {item.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                                            {Math.abs(item.changePercent)}%
                                        </div>
                                        <span className="text-2xl font-black text-indigo-950 tabular-nums">
                                            {formatPrice(item.currentPrice)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-8 flex items-center justify-center py-4 bg-indigo-50/20 rounded-3xl">
                                    <Sparkline history={item.history} color={item.change >= 0 ? '#10B981' : '#F43F5E'} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-50 mb-8 font-medium">
                                    <div className="min-w-0">
                                        <p className="text-indigo-900/40 text-[9px] font-black uppercase tracking-widest mb-1 truncate">24h Vol ({item.unit})</p>
                                        <p className="text-sm text-indigo-950 font-black truncate">{item.currentVolume.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right min-w-0">
                                        <p className="text-indigo-900/40 text-[9px] font-black uppercase tracking-widest mb-1 truncate">Day Range</p>
                                        <p className="text-sm text-indigo-950 font-black truncate">{item.dayLow} - {item.dayHigh}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/commodities/${item.id}`)}
                                    className="relative z-10 flex-1 py-4 bg-indigo-50 text-indigo-600 text-xs font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center uppercase tracking-widest"
                                >
                                    Analyze Asset
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const inWatchlist = watchlist.some(w => w.item_id === item.id);
                                        if (inWatchlist) {
                                            removeFromWatchlist(item.id, item.name, item.symbol);
                                        } else {
                                            addToWatchlist({
                                                item_id: item.id,
                                                item_name: item.name,
                                                symbol: item.symbol,
                                                item_type: 'commodity',
                                                price: item.currentPrice,
                                                change: item.change,
                                                change_pct: item.changePercent
                                            });
                                        }
                                    }}
                                    className={`relative z-10 p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 ${watchlist.some(w => w.item_id === item.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                                    title={watchlist.some(w => w.item_id === item.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                                >
                                    <FiStar className={watchlist.some(w => w.item_id === item.id) ? 'fill-current' : ''} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">🌍</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No commodities found</h3>
                        <p className="text-indigo-900/30 font-medium">Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>

            {/* Footer Disclaimer */}
            <div className="mt-16 p-10 bg-indigo-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl scale-150 group-hover:scale-175 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner">⚠️</div>
                    <div>
                        <h4 className="text-2xl font-black mb-2 tracking-tight">Market Risk Disclosure</h4>
                        <p className="text-indigo-200/60 font-medium text-sm leading-relaxed max-w-4xl">
                            Commodity futures and spot prices are subject to high volatility influenced by geopolitical factors, supply chain disruptions, and currency fluctuations. The data provided is for informational purposes only. WealthHarbour recommends professional financial consultation before engaging in commodity derivatives.
                        </p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default Commodities;

