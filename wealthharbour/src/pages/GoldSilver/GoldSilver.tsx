import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiClock, FiInfo, FiLayers, FiGlobe } from 'react-icons/fi';
import type { MetalPricePoint, MetalData } from '../../types/metals';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { useAppPreferences } from '../../store/slices/preferencesHooks';
import { MARKET_HOURS, REGULATORY_NOTE } from './goldSilverData';
import { fetchMetalData, calculateAdjustedPrice, formatCurrency } from './goldSilverService';

interface ForecastSignal {
    chance: string;
    condition: string;
}

interface ForecastData {
    title: string;
    whyIncrease: string[];
    signals: {
        buy: ForecastSignal;
        wait: ForecastSignal;
        sell: ForecastSignal;
    };
}

interface MetalsForecast {
    gold?: ForecastData;
    silver?: ForecastData;
}

const GoldSilver: React.FC = () => {
    const navigate = useNavigate();
    const [unit, setUnit] = useState<'gram' | 'ounce'>('gram');
    const { currency } = useAppPreferences();
    const [goldData, setGoldData] = useState<MetalData | null>(null);
    const [silverData, setSilverData] = useState<MetalData | null>(null);
    const [forecast, setForecast] = useState<MetalsForecast | null>(null);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const { MetalService, GuideService } = await import('../../services/api');
                const [goldRes, silverRes, forecastData, guideData] = await Promise.all([
                    fetchMetalData().then(res => res[0]),
                    fetchMetalData().then(res => res[1]),
                    MetalService.getForecast(),
                    GuideService.getGuide('metals')
                ]);
                setGoldData(goldRes);
                setSilverData(silverRes);
                setForecast(forecastData);
                setGuide(guideData);
            } catch (err) {
                console.error('Failed to load metals data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const ForecastCard = ({ data, color }: { data: ForecastData, color: string }) => {
        if (!data) return null;
        return (
            <div className="bg-white border border-indigo-50 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-indigo-100/10 overflow-hidden relative group">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 -mr-8 -mt-8 rounded-full`} style={{ backgroundColor: color }}></div>
                
                <h3 className="text-2xl font-black text-indigo-950 mb-8 flex items-center gap-3">
                    <FiGlobe className="text-indigo-400" /> {data.title}
                </h3>

                <div className="space-y-8">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Market Drivers</h4>
                        <ul className="space-y-4">
                            {data.whyIncrease.map((reason: string, i: number) => (
                                <li key={i} className="flex gap-4 text-sm font-medium text-indigo-900/70 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: color }}></span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Buy</span>
                                <span className="text-xs font-black text-emerald-600">{data.signals.buy.chance}</span>
                            </div>
                            <p className="text-[11px] font-bold text-emerald-900/60 leading-tight">{data.signals.buy.condition}</p>
                        </div>
                        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Wait</span>
                                <span className="text-xs font-black text-indigo-600">{data.signals.wait.chance}</span>
                            </div>
                            <p className="text-[11px] font-bold text-indigo-900/60 leading-tight">{data.signals.wait.condition}</p>
                        </div>
                        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Sell</span>
                                <span className="text-xs font-black text-rose-600">{data.signals.sell.chance}</span>
                            </div>
                            <p className="text-[11px] font-bold text-rose-900/60 leading-tight">{data.signals.sell.condition}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getPriceFormatted = (price: number) => {
        const adjustedPrice = calculateAdjustedPrice(price, unit, currency);
        return formatCurrency(adjustedPrice, currency);
    };


    const InteractiveChart = ({
        history,
        color
    }: {
        history: MetalPricePoint[],
        color: string
    }) => {
        const prices = history.map(h => h.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        const VIEW_WIDTH = 800;
        const VIEW_HEIGHT = 200;
        const PADDING = 20;

        const [hoveredPoint, setHoveredPoint] = useState<MetalPricePoint | null>(null);
        const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

        const points = useMemo(() => {
            return history.map((h, i) => {
                const x = (i / (history.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
                const y = VIEW_HEIGHT - PADDING - ((h.price - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING);
                return `${x},${y}`;
            }).join(' ');
        }, [history, min, range]);

        const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;

            const index = Math.round(((x - PADDING) / (VIEW_WIDTH - 2 * PADDING)) * (history.length - 1));
            if (index >= 0 && index < history.length) {
                setHoveredPoint(history[index]);
                const pointX = (index / (history.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
                setMousePos({ x: pointX, y: 0 });
            }
        };

        return (
            <div className="flex flex-col gap-4 mt-6">
                <div className="flex justify-between items-end px-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-900/20">30D PERFORMANCE HISTORICAL CHANNEL</div>
                    {hoveredPoint && (
                        <div className="text-right">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">{hoveredPoint.date}</p>
                            <p className="text-lg md:text-2xl font-black text-indigo-950 leading-none">{getPriceFormatted(hoveredPoint.price)}</p>
                        </div>
                    )}
                </div>

                <div className="relative w-full h-[180px] md:h-[250px] bg-indigo-50/20 rounded-[2rem] p-4 border border-indigo-50 overflow-hidden group/chart">
                    <svg
                        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                        className="w-full h-full cursor-crosshair"
                        preserveAspectRatio="none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        <defs>
                            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`M ${PADDING},${VIEW_HEIGHT} L ${points} L ${VIEW_WIDTH - PADDING},${VIEW_HEIGHT} Z`}
                            fill={`url(#grad-${color.replace('#', '')})`}
                        />
                        <polyline
                            points={points}
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {hoveredPoint && (
                            <>
                                <line
                                    x1={mousePos.x}
                                    y1={0}
                                    x2={mousePos.x}
                                    y2={VIEW_HEIGHT}
                                    stroke={color}
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={mousePos.x}
                                    cy={VIEW_HEIGHT - PADDING - ((hoveredPoint.price - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                                    r="6"
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="3"
                                />
                            </>
                        )}
                    </svg>
                </div>
            </div>
        );
    };

    const MetalSegment = ({
        data,
        color,
        iconColor
    }: {
        data: MetalData,
        color: string,
        iconColor: string
    }) => {
        const displayPoint = data.history[data.history.length - 1];

        return (
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/30 hover:shadow-indigo-200/50 transition-all duration-700 group overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 pb-8 border-b border-indigo-50">
                    <div className="space-y-3">
                        <div className="flex items-center gap-6">
                            <div className={`p-5 ${iconColor} rounded-[2rem] text-white shadow-2xl group-hover:scale-110 transition-transform shrink-0`}>
                                <FiLayers className="text-3xl" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl md:text-5xl font-black text-indigo-950 tracking-tighter truncate">{data.name} Analysis</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start w-full lg:w-auto gap-4">
                        <div>
                            <p className="text-indigo-900/40 text-[11px] font-black uppercase tracking-widest mb-1">
                                Market Price ({unit})
                            </p>
                            <span className="text-3xl md:text-6xl font-black text-indigo-950 tabular-nums leading-none">
                                {getPriceFormatted(displayPoint.price)}
                            </span>
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-black rounded-xl flex items-center gap-2 shrink-0">
                            <FiTrendingUp className="text-[12px]" /> 1.2%
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-8 py-4 bg-indigo-50/30 rounded-2xl mb-2 text-indigo-900/60 font-medium border border-white/50 gap-4 overflow-hidden">
                    <div className="flex items-center justify-between md:justify-start gap-8 min-w-0">
                        <div className="min-w-0">
                            <span className="text-[11px] font-black uppercase block tracking-widest opacity-50">Live Rate</span>
                            <span className="text-xl font-black text-indigo-950 truncate">{getPriceFormatted(displayPoint.price)}</span>
                        </div>
                        <div className="h-10 w-px bg-indigo-100 hidden md:block shrink-0" />
                        <div className="hidden sm:block min-w-0">
                            <span className="text-[11px] font-black uppercase block tracking-widest opacity-50">Tax (est.)</span>
                            <span className="text-xl font-black text-indigo-950 truncate">3% GST</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-indigo-50 pt-4 md:pt-0 shrink-0">
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Market Open</span>
                        <span className="text-[11px] font-bold opacity-50 ml-4 md:ml-0">Updated: 1m</span>
                    </div>
                </div>

                <InteractiveChart
                    history={data.history}
                    color={color}
                />

                <div className="mt-10 text-center sm:text-right">
                    <button 
                        onClick={() => {
                            const name = data.name.toLowerCase();
                            navigate(`/gold-silver/${name}`);
                        }}
                        className="px-8 py-4 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                        Market Intel
                    </button>
                </div>
            </div>
        );
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Precious Metals"
                subtitle="Live historical tracking and rates for Gold & Silver"
                icon={<FiLayers className="text-amber-500" />}
                guide={guide}
                guideColor="amber"
            >
                <div className="bg-indigo-50 p-1.5 rounded-2xl flex gap-1">
                    <button
                        onClick={() => setUnit('gram')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'gram' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
                    >
                        Gram
                    </button>
                    <button
                        onClick={() => setUnit('ounce')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'ounce' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
                    >
                        Ounce
                    </button>
                </div>
            </PageHeader>

            <div className="space-y-12">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-48">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mb-6"></div>
                        <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Weighting Assets...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-12 stagger-children">
                            {goldData && <MetalSegment data={goldData} color="#F59E0B" iconColor="bg-amber-500" />}
                            {silverData && <MetalSegment data={silverData} color="#94A3B8" iconColor="bg-slate-500" />}
                        </div>
                        
                        {/* Forecast Section */}
                        <div className="mt-24 space-y-16">
                            <div className="border-l-8 border-indigo-600 pl-8">
                                <h2 className="text-5xl font-black text-indigo-950 tracking-tighter">Market Forecast</h2>
                                <p className="text-indigo-900/40 font-black uppercase tracking-widest text-xs mt-4">Predictive signals for the next cycle</p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {forecast?.gold && <ForecastCard data={forecast.gold} color="#F59E0B" />}
                                {forecast?.silver && <ForecastCard data={forecast.silver} color="#94A3B8" />}
                            </div>
                        </div>
                    </>
                )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
                <div className="p-10 md:p-12 bg-indigo-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <FiInfo className="text-indigo-400" /> Regulatory Note
                    </h3>
                    <p className="text-indigo-200/60 leading-relaxed font-medium text-sm">
                        {REGULATORY_NOTE}
                    </p>
                </div>
                <div className="p-10 md:p-12 bg-white border border-indigo-50 rounded-[3rem] shadow-xl shadow-indigo-100/10">
                    <h3 className="text-2xl font-black text-indigo-950 mb-8 flex items-center gap-3">
                        <FiClock className="text-indigo-400" /> Market Hours
                    </h3>
                    <div className="space-y-6">
                        {MARKET_HOURS.map((hour, idx) => (
                            <div key={idx} className={`flex justify-between items-center text-sm ${idx === 0 ? 'border-b border-indigo-50 pb-4' : ''}`}>
                                <span className="font-black text-indigo-900/40 uppercase tracking-widest text-[10px]">{hour.label}</span>
                                <span className="font-black text-indigo-950">{hour.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default GoldSilver;
