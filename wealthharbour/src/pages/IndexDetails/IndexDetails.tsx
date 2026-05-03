import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiTrendingUp, FiTrendingDown, FiPieChart,
    FiActivity, FiTarget, FiDollarSign, FiBarChart2, FiAward,
    FiArrowUpRight, FiArrowDownRight, FiBriefcase, FiLayers, FiGlobe, FiShield,
    FiZap, FiCheckCircle, FiRepeat
} from 'react-icons/fi';
import { IndexService } from '../../services/api';
import type { MarketIndex } from '../../types/indexData';
import PriceHistoryChart from '../../components/common/PriceHistoryChart';
import MetricInfo from '../../components/common/MetricInfo';
import { useAppSelector } from '../../store/hooks';
import { addToWatchlist, removeFromWatchlist } from '../../utils/watchlistUtils';
import { FiCheck, FiPlus } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PortfolioAnalysis from '../../components/common/PortfolioAnalysis';

const getSentimentStyles = (sentiment: string) => {
    switch (sentiment?.toUpperCase()) {
        case 'BULLISH': return 'bg-emerald-100 text-emerald-700';
        case 'BEARISH': return 'bg-rose-100 text-rose-700';
        default: return 'bg-amber-100 text-amber-700';
    }
};

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toUpperCase()) {
        case 'BULLISH': return { text: 'text-emerald-600', bg: 'bg-emerald-50/30' };
        case 'BEARISH': return { text: 'text-rose-600', bg: 'bg-rose-50/30' };
        default: return { text: 'text-amber-600', bg: 'bg-amber-50/30' };
    }
};

const IndexDetails: React.FC = () => {

    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [indexData, setIndexData] = useState<MarketIndex | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const watchlist = useAppSelector(state => state.auth.watchlist);
    const inWatchlist = indexData ? watchlist.some(w => w.item_id === indexData.name) : false;

    const toggleWatchlist = () => {
        if (!indexData) return;
        if (inWatchlist) {
            removeFromWatchlist(indexData.name, indexData.name, indexData.name);
        } else {
            addToWatchlist({
                item_id: indexData.name,
                item_name: indexData.name,
                symbol: indexData.name,
                item_type: 'index',
                price: parseFloat(indexData.value.replace(/,/g, '')),
                change: parseFloat(indexData.change.replace(/[^0-9.-]+/g, "")),
            });
        }
    };


    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await IndexService.getIndexByName(decodeURIComponent(name || ''));
                if (data) setIndexData(data);
                else setError('Index not found');
            } catch {
                setError('Failed to load index details');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [name]);

    const sections = useMemo(() => {
        if (!indexData) return [];
        return [
            {
                title: 'Price Action',
                icon: <FiZap className="text-amber-500" />,
                metrics: [
                    { label: 'Today High', value: indexData.todayHigh, icon: <FiArrowUpRight /> },
                    { label: 'Today Low', value: indexData.todayLow, icon: <FiArrowDownRight /> },
                    { label: '52-Week High', value: indexData.week52High, icon: <FiTrendingUp /> },
                    { label: '52-Week Low', value: indexData.week52Low, icon: <FiTrendingDown /> },
                    { label: 'All-Time High', value: indexData.allTimeHigh, icon: <FiAward /> },
                    { label: 'All-Time Low', value: indexData.allTimeLow, icon: <FiTarget /> },
                ]
            },
            {
                title: 'Composition & Risk',
                icon: <FiShield className="text-rose-500" />,
                metrics: [
                    { label: 'Market Cap Category', value: indexData.marketCapCategory, icon: <FiLayers /> },
                    { label: 'Standard Deviation', value: indexData.standardDeviation, icon: <FiActivity />, suffix: '%' },
                    { label: 'Beta', value: indexData.beta, icon: <FiZap /> },
                    { label: 'Sharpe Ratio', value: indexData.sharpeRatio, icon: <FiAward /> },
                    { label: 'Downside Capture', value: indexData.downsideCaptureRatio, icon: <FiTrendingDown />, suffix: '%' },
                    { label: 'Stock Concentration (Top 10)', value: `${indexData.stockConcentration?.top10}%`, icon: <FiPieChart /> },
                ]
            },
            {
                title: 'Fund Health & Accuracy',
                icon: <FiCheckCircle className="text-emerald-500" />,
                metrics: [
                    { label: 'Tracking Error', value: indexData.trackingError, icon: <FiTarget />, suffix: '%' },
                    { label: 'Tracking Difference', value: indexData.trackingDifference, icon: <FiActivity />, suffix: '%' },
                    { label: 'Expense Ratio', value: indexData.expenseRatio, icon: <FiDollarSign />, suffix: '%' },
                    { label: 'AUM', value: indexData.aum, icon: <FiBriefcase /> },
                    { label: 'PTR (Turnover)', value: indexData.ptr, icon: <FiRepeat />, suffix: '' },
                    { label: 'Liquidity', value: indexData.liquidity, icon: <FiGlobe /> },
                ]
            },
            {
                title: 'Valuation',
                icon: <FiBarChart2 className="text-indigo-500" />,
                metrics: [
                    { label: 'Index P/E Ratio', value: indexData.peRatio, icon: <FiActivity /> },
                    { label: 'Index P/B Ratio', value: indexData.pbRatio, icon: <FiPieChart /> },
                    { label: 'Dividend Yield', value: indexData.divYield, icon: <FiDollarSign />, suffix: '%' },
                    { label: 'Market Cap', value: indexData.marketCapValue, icon: <FiBriefcase /> },
                    { label: 'Stock Concentration (Top 5)', value: `${indexData.stockConcentration?.top5}%`, icon: <FiTarget /> },
                    { label: 'Cash Drag', value: indexData.cashDrag, icon: <FiActivity />, suffix: '%' },
                ]
            },
            {
                title: 'Trading & Market Data',
                icon: <FiGlobe className="text-emerald-500" />,
                metrics: [
                    { label: 'Trading Volume', value: indexData.tradingVolume, icon: <FiActivity /> },
                    { label: 'iNAV', value: indexData.iNAV, icon: <FiZap /> },
                    { label: 'Bid-Ask Spread', value: indexData.bidAskSpread, icon: <FiLayers />, suffix: '%' },
                    { label: 'Premium/Discount', value: indexData.premiumDiscount, icon: <FiTrendingUp />, suffix: '%' },
                    { label: 'Exit Load', value: indexData.exitLoad, icon: <FiArrowDownRight /> },
                    { label: 'Fund House History', value: indexData.fundHouseHistory, icon: <FiAward /> },
                ]
            }
        ];
    }, [indexData]);

    if (isLoading) return (
        <div className="flex-1 flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !indexData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">{error || 'Index not found'}</h2>
                <button onClick={() => navigate('/indices')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Back to Indices</button>
            </div>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/indices')} className="p-3 bg-white border border-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-sm">
                        <FiArrowLeft className="text-lg md:text-xl" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-white text-[9px] md:text-[10px] font-black rounded uppercase tracking-widest ${indexData.exchange === 'NSE' ? 'bg-indigo-600' : 'bg-amber-600'}`}>
                                {indexData.exchange}
                            </span>
                            <span className="text-indigo-900/40 text-[10px] md:text-sm font-bold uppercase tracking-widest truncate">Major Market Index</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-indigo-950 tracking-tight leading-tight">{indexData.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleWatchlist} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${inWatchlist ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}>
                        {inWatchlist ? <FiCheck /> : <FiPlus />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 md:p-10 rounded-[2rem] text-white shadow-2xl shadow-indigo-100">
                    <p className="text-indigo-100/60 font-bold uppercase tracking-widest text-[10px] mb-2">Current Value</p>
                    <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-4xl md:text-6xl font-black">{indexData.value}</span>
                        <div className={`flex items-center gap-1 font-black text-lg md:text-xl ${indexData.isPositive ? 'text-emerald-300' : (indexData.change || '').includes('0.00') ? 'text-amber-300' : 'text-rose-300'}`}>
                            {indexData.isPositive ? <FiTrendingUp /> : (indexData.change || '').includes('0.00') ? <FiActivity /> : <FiTrendingDown />}
                            <span>{indexData.change || '0.00%'}</span>
                        </div>

                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">AUM Size</p>
                            <p className="text-xl md:text-2xl font-black text-white">{indexData.aum || '₹14,500 Cr'}</p>
                        </div>
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">Liquidity</p>
                            <p className="text-xl md:text-2xl font-black text-white">{indexData.liquidity || 'High'}</p>
                        </div>
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">Invested</p>
                            <p className="text-xl md:text-2xl font-black text-emerald-300">₹45,200</p>
                        </div>
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">Ready to Deploy</p>
                            <p className="text-xl md:text-2xl font-black text-indigo-200">₹1,50,000</p>
                        </div>
                    </div>
                </div>



                <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-50/50">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                    <FiActivity className="text-xl" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-indigo-950 font-black text-lg tracking-tight uppercase">Expert View</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${getSentimentStyles(indexData.longTermView || 'Neutral')}`}>
                                            {indexData.longTermView}
                                        </span>
                                    </div>
                                    <p className="text-indigo-900/50 text-[11px] font-bold leading-relaxed max-w-md">
                                        Based on current earnings growth and technical indicators, the outlook remains <span className="text-indigo-900">{indexData.longTermView?.toLowerCase()}</span>.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Score</p>
                                    <p className="text-xl font-black text-indigo-950 leading-none">{indexData.fundamentalsScore}</p>
                                </div>
                                <div className="h-8 w-px bg-indigo-100" />
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">Premium</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Metrics Grid - Full Width */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Short Term', value: indexData.shortTermView, ...getSentimentColor(indexData.shortTermView || 'Neutral') },
                                { label: 'Mid Term', value: indexData.midTermView ?? 'NEUTRAL', ...getSentimentColor(indexData.midTermView ?? 'NEUTRAL') },
                                { label: 'Long Term', value: indexData.longTermView, ...getSentimentColor(indexData.longTermView || 'Neutral') }
                            ].map((m, i) => (
                                <div key={i} className={`${m.bg} p-4 rounded-2xl border border-white/50 flex flex-col justify-center`}>
                                    <span className="text-indigo-900/40 text-[9px] font-black uppercase tracking-widest mb-1 truncate">{m.label}</span>
                                    <span className={`${m.text} text-xs font-black uppercase truncate`}>{m.value}</span>

                                </div>
                            ))}
                        </div>



                        {/* Validations Row */}
                        {indexData.validations && indexData.validations.length > 0 && (
                            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-indigo-50/50">
                                {indexData.validations.slice(0, 4).map((v, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="bg-emerald-500 rounded-full p-0.5">
                                            <FiCheckCircle className="text-white text-[8px]" />
                                        </div>
                                        <span className="text-[10px] text-indigo-950/60 font-bold tracking-tight">{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>


            {/* Price History Chart */}
            <div className="mb-12">
                <div className="bg-white rounded-[2.5rem] p-0 border border-indigo-50 shadow-sm overflow-hidden">
                    <PriceHistoryChart history={indexData.history} color={indexData.isPositive ? "#10B981" : "#F43F5E"} title={`${indexData.name} Points History`} />
                </div>
            </div>

            {/* Parameter Sections */}
            <div className="space-y-12">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="stagger-children">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-indigo-50">{section.icon}</div>
                            <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{section.title}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {section.metrics.map((metric, mIdx) => (
                                <div key={mIdx} className="bg-white p-6 rounded-3xl border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all group relative overflow-hidden">
                                    <MetricInfo metricKey={metric.label} />
                                    <div className="text-indigo-300 mb-3 group-hover:text-indigo-600 transition-colors">{metric.icon}</div>
                                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-1">{metric.label}</p>
                                    <p className="text-base font-black text-indigo-950 truncate">
                                        {metric.value ?? 'N/A'}{metric.suffix ?? ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Portfolio Analysis: Holdings and Changes */}
            <PortfolioAnalysis 
                title="Index Constituents & Weightage"
                holdings={indexData.topHoldings || (indexData.underlyingCompanies?.map(co => ({ 
                    name: co, 
                    weightage: Math.floor(Math.random() * 10) + 1,
                    sector: 'Various'
                })) || [])}
                changes={indexData.portfolioChanges || {
                    newlyAdded: [
                        { name: 'Tata Motors', weightage: 1.2, sector: 'Auto' },
                        { name: 'Zomato Ltd', weightage: 0.8, sector: 'Internet' }
                    ],
                    removed: [
                        { name: 'Coal India', weightage: 0, sector: 'Energy' }
                    ],
                    increased: [
                        { name: 'HDFC Bank', weightage: 12.5, change: 0.4 },
                        { name: 'Reliance Ind.', weightage: 10.2, change: 0.15 }
                    ],
                    decreased: [
                        { name: 'Infosys', weightage: 8.1, change: -0.2 }
                    ]
                }}
            />

            {/* Sector Weightage */}
            <div className="mt-12 card-luxury p-8">
                <div className="flex items-center gap-3 mb-8">
                    <FiPieChart className="text-indigo-600" />
                    <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Sector Weightage</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {indexData.sectorWeightage?.map((s, i) => (
                        <div key={i}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-indigo-900/70 text-sm">{s.sector}</span>
                                <span className="font-black text-indigo-950 text-sm">{s.weight}%</span>
                            </div>
                            <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600" style={{ width: `${s.weight}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </PageShell>
    );
};

export default IndexDetails;

