import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiActivity, FiBriefcase, FiUser, FiTrendingUp, 
    FiDownload, FiPlus, FiCheck, FiShield, FiLayers, 
    FiMinusCircle, FiTrendingDown,
    FiTarget, FiDollarSign, FiAward, FiRepeat, FiZap, FiCheckCircle
} from 'react-icons/fi';
import PriceHistoryChart from '../../components/common/PriceHistoryChart';
import MetricInfo from '../../components/common/MetricInfo';
import { addToWatchlist, removeFromWatchlist } from '../../utils/watchlistUtils';
import { useAppSelector } from '../../store/hooks';
import type { MutualFund } from '../../types/mutualFund';
import FundPerformanceSection from '../../components/fund/FundPerformanceSection';
import { formatNumberEnIn, formatIntegerEnIn } from '../../utils/numberFormat';
import PageShell from '../../components/layout/PageShell';
import PortfolioAnalysis from '../../components/common/PortfolioAnalysis';
import { fetchMFAnalysis } from './mutualFundDetailsService';

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

const MutualFundDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    
    const [fund, setFund] = useState<MutualFund | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const inWatchlist = fund ? watchlist.some(w => w.item_id === fund.id) : false;

    const loadFund = async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchMFAnalysis(id);
            if (data) setFund(data);
            else setError("Mutual Fund not found");
        } catch (err) {
            setError("Failed to load mutual fund details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFund();
    }, [id]);

    const sections = useMemo(() => {
        if (!fund) return [];
        return [
            {
                title: 'Performance & Risk',
                icon: <FiShield className="text-rose-500" />,
                metrics: [
                    { label: 'Alpha', value: fund.alpha, icon: <FiAward />, suffix: '%' },
                    { label: 'Beta', value: fund.beta, icon: <FiZap /> },
                    { label: 'Sharpe Ratio', value: fund.sharpeRatio, icon: <FiTarget /> },
                    { label: 'Sortino Ratio', value: fund.sortinoRatio, icon: <FiTrendingUp /> },
                    { label: 'Std. Deviation', value: fund.standardDeviation, icon: <FiActivity />, suffix: '%' },
                    { label: 'Rolling Returns (3Y)', value: fund.rollingReturns3Y, icon: <FiRepeat />, suffix: '%' },
                    { label: 'Rolling Returns (5Y)', value: fund.rollingReturns5Y, icon: <FiRepeat />, suffix: '%' },
                ]
            },
            {
                title: 'Fund Health & Efficiency',
                icon: <FiCheckCircle className="text-emerald-500" />,
                metrics: [
                    { label: 'Expense Ratio', value: fund.expenseRatio, icon: <FiDollarSign />, suffix: '%' },
                    { label: 'Portfolio Turnover', value: fund.portfolioTurnover, icon: <FiRepeat />, suffix: '%' },
                    { label: 'Tracking Error', value: fund.trackingError, icon: <FiTarget />, suffix: '%' },
                    { label: 'Cash Levels', value: fund.cashLevels, icon: <FiLayers />, suffix: '%' },
                    { label: 'AUM', value: fund.aum, icon: <FiBriefcase /> },
                    { label: 'Exit Load', value: fund.exitLoad, icon: <FiMinusCircle /> },
                ]
            },
            {
                title: 'Investment Details',
                icon: <FiTarget className="text-indigo-500" />,
                metrics: [
                    { label: 'Min. SIP', value: `₹${formatIntegerEnIn(fund.minSIP)}`, icon: <FiPlus /> },
                    { label: 'Min. Lumpsum', value: `₹${formatIntegerEnIn(fund.minLumpsum || 5000)}`, icon: <FiBriefcase /> },
                    { label: 'Lock-in Period', value: fund.lockInPeriod || 'None', icon: <FiShield /> },
                    { label: 'Stamp Duty', value: fund.stampDuty, icon: <FiDollarSign /> },
                    { label: 'Tax Saving', value: fund.isTaxSaving ? 'Yes' : 'No', icon: <FiCheck /> },
                ]
            }
        ];
    }, [fund]);

    const toggleWatchlist = () => {
        if (!fund) return;
        if (inWatchlist) {
            removeFromWatchlist(fund.id, fund.name, fund.id);
        } else {
            addToWatchlist({
                item_id: fund.id,
                item_name: fund.name,
                symbol: fund.id,
                item_type: 'mutual-fund',
                price: fund.nav,
                change: fund.change,
                change_pct: fund.changePercent
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !fund) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <h2 className="text-2xl font-black text-indigo-950 mb-4">{error || "Fund not found"}</h2>
                <button onClick={() => navigate('/mutual-funds')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black">Back to Mutual Funds</button>
            </div>
        );
    }

    const performanceData = [
        { period: '1 Year', fund: fund.return1Y, benchmark: fund.benchmarkReturn1Y, category: fund.categoryAverage1Y },
        { period: '3 Year', fund: fund.return3Y, benchmark: fund.benchmarkReturn3Y, category: fund.categoryAverage3Y },
        { period: '5 Year', fund: fund.return5Y, benchmark: fund.benchmarkReturn5Y, category: fund.categoryAverage5Y },
    ];

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/mutual-funds')} className="p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded uppercase tracking-widest">{fund.sector}</span>
                            <span className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest">{fund.fundHouse}</span>
                        </div>
                        <h1 className="text-3xl font-black text-indigo-950 tracking-tight leading-tight">{fund.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleWatchlist} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${inWatchlist ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}>
                        {inWatchlist ? <FiCheck /> : <FiPlus />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 md:p-10 rounded-[2rem] text-white shadow-2xl shadow-indigo-200">
                    <p className="text-indigo-100/60 font-black uppercase tracking-widest text-[10px] mb-3">Net Asset Value (NAV)</p>
                    <div className="flex items-baseline gap-6 flex-wrap">
                        <span className="text-4xl md:text-6xl font-black">₹{formatNumberEnIn(fund.nav)}</span>
                        <div className={`flex items-center gap-1 font-black text-lg md:text-xl ${(fund.change || 0) > 0 ? 'text-emerald-300' : (fund.change || 0) < 0 ? 'text-rose-300' : 'text-amber-300'}`}>
                            {(fund.change || 0) > 0 ? <FiTrendingUp /> : (fund.change || 0) < 0 ? <FiTrendingDown /> : <FiActivity />}
                            <span>{(fund.change || 0) > 0 ? '+' : ''}{fund.changePercent || 0}% ({fund.change || 0})</span>
                        </div>

                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">1Y Return</p>
                            <p className="text-xl md:text-2xl font-black text-emerald-300">{fund.return1Y}%</p>
                        </div>
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">3Y Return</p>
                            <p className="text-xl md:text-2xl font-black text-emerald-300">{fund.return3Y}%</p>
                        </div>
                        <div>
                            <p className="text-indigo-100/40 text-[10px] font-black uppercase tracking-widest mb-1">Min. SIP</p>
                            <p className="text-xl md:text-2xl font-black text-white">₹{formatIntegerEnIn(fund.minSIP)}</p>
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
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${getSentimentStyles(fund.longTermView || 'Neutral')}`}>
                                            {fund.longTermView || 'Neutral'}
                                        </span>
                                    </div>

                                    <p className="text-indigo-900/50 text-[11px] font-bold leading-relaxed max-w-md">
                                        {(fund.description || '').length > 150 ? (fund.description || '').substring(0, 150) + '...' : (fund.description || '')}
                                    </p>

                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Fund Score</p>
                                    <p className="text-xl font-black text-indigo-950 leading-none">{fund.fundamentalsScore}</p>
                                </div>
                                <div className="h-8 w-px bg-indigo-100" />
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Risk Grade</p>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase">Standard</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Outlook Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Short Term', value: fund.shortTermView || 'Neutral', ...getSentimentColor(fund.shortTermView || 'Neutral') },
                                { label: 'Mid Term', value: fund.midTermView || 'Bullish', ...getSentimentColor(fund.midTermView || 'Bullish') },
                                { label: 'Long Term', value: fund.longTermView || 'Bullish', ...getSentimentColor(fund.longTermView || 'Bullish') }
                            ].map((m, i) => (
                                <div key={i} className={`${m.bg} p-4 rounded-2xl border border-white/50 flex flex-col justify-center`}>
                                    <span className="text-indigo-900/40 text-[9px] font-black uppercase tracking-widest mb-1 truncate">{m.label} Outlook</span>
                                    <span className={`${m.text} text-xs font-black uppercase truncate`}>{m.value}</span>
                                </div>
                            ))}
                        </div>




                        {/* Analysis Tags */}
                        {fund.validations && fund.validations.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-indigo-50/50">
                                {fund.validations.slice(0, 4).map((v, i) => (
                                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                                        {v}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>


            {/* Price Chart */}
            <div className="mb-16">
                <div className="bg-white rounded-[2.5rem] p-0 border border-indigo-50 shadow-sm overflow-hidden">
                    <PriceHistoryChart history={fund.history} color="#6366F1" title={`${fund.name} NAV History`} />
                </div>
            </div>

            {/* Performance Section */}
            <FundPerformanceSection id={fund.id} name={fund.name} benchmarkName={fund.benchmarkName} performance={performanceData} />

            {/* Parameter Sections */}
            <div className="space-y-16 mt-20">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="stagger-children">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-indigo-50">{section.icon}</div>
                            <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{section.title}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                title="Fund Holdings & Weightage"
                holdings={fund.topHoldings.map(h => ({ 
                    name: h.company, 
                    weightage: h.allocation,
                    sector: h.sector 
                }))}
                changes={fund.portfolioChanges || {
                    newlyAdded: [
                        { name: 'Adani Ports', weightage: 2.1, sector: 'Infrastructure' },
                        { name: 'LTIMindtree', weightage: 1.5, sector: 'IT' }
                    ],
                    removed: [
                        { name: 'Wipro Ltd', weightage: 0, sector: 'IT' }
                    ],
                    increased: [
                        { name: 'ICICI Bank', weightage: 8.4, change: 0.5 },
                        { name: 'SBI', weightage: 4.2, change: 0.3 }
                    ],
                    decreased: [
                        { name: 'Reliance Ind.', weightage: 7.1, change: -0.4 }
                    ]
                }}
            />

            {/* Management & Documents */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-luxury p-8 md:p-10">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl shadow-xl shadow-indigo-100">
                            <FiUser />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Fund Manager</p>
                            <h3 className="text-3xl font-black text-indigo-950">{fund.fundManager?.name || 'Lead Manager'}</h3>
                            <p className="text-sm font-bold text-indigo-900/50 mt-1">{fund.fundManager?.tenure || 'N/A'} tenure in this fund</p>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-indigo-50">
                        <div>
                            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-4">Background</h4>
                            <div className="space-y-3">
                                <div className="flex gap-3 text-sm font-medium text-indigo-900/70">
                                    <FiBriefcase className="text-indigo-400 shrink-0 mt-1" />
                                    <span>{fund.fundManager?.experience || 'Experienced portfolio manager with a track record of consistent performance.'}</span>
                                </div>
                                <div className="flex gap-3 text-sm font-medium text-indigo-900/70">
                                    <FiAward className="text-indigo-400 shrink-0 mt-1" />
                                    <span>{fund.fundManager?.education || 'Post Graduate in Finance / CFA'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-4">Other Managed Funds</h4>
                            <div className="flex flex-wrap gap-2">
                                {(fund.fundManager?.otherFunds || ['Growth Fund', 'Equity Fund']).map((f, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold border border-indigo-100">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            <FiDownload className="text-indigo-300" /> Documents
                        </h3>
                        <div className="space-y-4">
                            {(fund.schemeDocuments || []).map((doc, i) => (
                                <a key={i} href={doc.url} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group border border-white/5">
                                    <span className="text-sm font-bold text-white/80 group-hover:text-white">{doc.name}</span>
                                    <FiDownload className="text-white/40 group-hover:text-white" />
                                </a>
                            ))}

                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Tax Implication</span>
                            <span className="text-sm font-black text-white">{fund.taxImplication}</span>
                        </div>
                        <p className="text-[10px] text-white/30 italic leading-relaxed">
                            Investments are subject to market risks. Read all scheme related documents carefully.
                        </p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default MutualFundDetails;

