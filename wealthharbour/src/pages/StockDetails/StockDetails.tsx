import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiTrendingUp, FiTrendingDown, FiPieChart,
    FiActivity, FiTarget, FiBarChart2, FiAward, FiRefreshCw,
    FiCheckCircle, FiAlertCircle, FiDollarSign, FiLayers
} from 'react-icons/fi';
import PriceHistoryChart from '../../components/common/PriceHistoryChart';
import MetricInfo from '../../components/common/MetricInfo';
import { removeFromWatchlist, addToWatchlist } from '../../utils/watchlistUtils';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { useAppSelector } from '../../store/hooks';
import type { Stock } from '../../types/stock';
import RevenueMixSection from '../../components/stock/RevenueMixSection';
import PeerComparisonSection from '../../components/stock/PeerComparisonSection';
import CorporateActionsSection from '../../components/stock/CorporateActionsSection';
import DocumentsSection from '../../components/stock/DocumentsSection';
import AnalysisViewsSection from '../../components/stock/AnalysisViewsSection';
import PageShell from '../../components/layout/PageShell';
import { formatNumberEnIn, formatMetricCell } from '../../utils/numberFormat';
import * as StockAnalysisService from './stockDetailsService';
import SectionTitle from '../../components/common/SectionTitle';
import {
    QuarterlyResultsSection,
    ProfitLossSection,
    BalanceSheetSection,
    CashFlowSection,
    ShareholdingSection
} from './AnalysisComponents';

// Main Component ─────────────────────────────────────────
const StockDetails: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    const [stock, setStock] = useState<Stock | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const inWatchlist = stock ? watchlist.some(w => w.item_id === stock.symbol) : false;

    /**
     * Refactored Load Function — Uses individual analysis functions.
     * Everything is a function call to the analysis service.
     */
    const loadStockDetails = React.useCallback(async () => {
        if (!symbol) return;
        setIsLoading(true);
        setError(null);
        try {
            // Fetch unified data in a single API call
            const data = await StockAnalysisService.fetchStockAnalysis(symbol);

            if (data) {
                setStock(data);
            } else {
                setError('Stock not found');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load stock details');
        } finally {
            setIsLoading(false);
        }
    }, [symbol]);

    React.useEffect(() => {
        loadStockDetails();
    }, [loadStockDetails]);

    const toggleWatchlist = () => {
        if (!stock) return;
        if (inWatchlist) {
            removeFromWatchlist(stock.symbol, stock.name, stock.symbol);
        } else {
            addToWatchlist({
                item_id: stock.symbol,
                item_name: stock.name,
                symbol: stock.symbol,
                item_type: 'stock',
                price: stock.price,
                change: stock.change,
                change_pct: stock.changePercent
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-indigo-900/60 font-bold tracking-widest uppercase">Analyzing Market Data...</p>
            </div>
        );
    }

    if (error || !stock) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">{error || 'Stock not found'}</h2>
                <button onClick={() => navigate('/stocks')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                    Back to Stocks
                </button>
            </div>
        );
    }

    const displayMetrics = [
        { label: 'P/E Ratio', value: stock.peRatio, icon: <FiActivity />, suffix: '' },
        { label: 'Market Cap', value: stock.marketCapValue, icon: <FiPieChart />, suffix: '' },
        { label: 'Div. Yield', value: stock.dividendYield, icon: <FiTarget />, suffix: '%' },
        { label: 'ROCE', value: stock.roce, icon: <FiAward />, suffix: '%' },
        { label: 'ROE', value: stock.roe, icon: <FiBarChart2 />, suffix: '%' },
        { label: 'Book Value', value: `₹${stock.bookValue}`, icon: <FiLayers />, suffix: '' },
        { label: 'Net Profit', value: stock.netProfit, icon: <FiTarget />, suffix: '' },
        { label: 'Face Value', value: `₹${stock.faceValue}`, icon: <FiDollarSign />, suffix: '' },
        { label: 'Day High', value: `₹${stock.dayHigh}`, icon: <FiTrendingUp />, suffix: '' },
        { label: 'Day Low', value: `₹${stock.dayLow}`, icon: <FiTrendingDown />, suffix: '' },
        { label: 'Debt to Equity', value: stock.debtToEquity, icon: <FiActivity />, suffix: '' },
        { label: '52W High', value: `₹${stock.fiftyTwoWeekHigh}`, icon: <FiTrendingUp />, suffix: '' },
        { label: '52W Low', value: `₹${stock.fiftyTwoWeekLow}`, icon: <FiTrendingDown />, suffix: '' },
    ];

    return (
        <PageShell className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/stocks')}
                        className="p-3 bg-white border border-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
                        aria-label="Back to stocks"
                        title="Back to stocks"
                    >
                        <FiArrowLeft className="text-lg md:text-xl" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] md:text-[11px] font-black rounded uppercase tracking-widest shrink-0">
                                {stock.symbol}
                            </span>
                            <span className="text-indigo-900/50 text-[11px] md:text-sm font-bold uppercase tracking-widest truncate">
                                {stock.sector} • {stock.marketCap}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-3xl font-black text-indigo-950 tracking-tight leading-tight break-words">{stock.name}</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={toggleWatchlist}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100/50 text-[11px] md:text-sm ${inWatchlist
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        {inWatchlist ? <FiCheck className="shrink-0" /> : <FiPlus className="shrink-0" />}
                        <span className="whitespace-nowrap">{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                    </button>
                    <button
                        onClick={() => { loadStockDetails(); }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white border border-indigo-100 text-indigo-600 font-bold rounded-xl md:rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-indigo-100/50 text-[11px] md:text-sm"
                    >
                        <FiRefreshCw className="shrink-0" />
                        <span className="whitespace-nowrap">Analyse Stocks</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-indigo-100/70 font-bold uppercase tracking-widest text-[10px] mb-2 md:mb-3">Live Price</p>
                            <div className="flex items-baseline gap-2 md:gap-6 flex-wrap">
                                <span className="text-3xl md:text-5xl font-black">₹{formatNumberEnIn(stock.price)}</span>
                                <div className={`flex items-center gap-1 font-black text-sm md:text-xl ${stock.change > 0 ? 'text-emerald-300' : stock.change < 0 ? 'text-rose-300' : 'text-amber-300'}`}>
                                    {stock.change > 0 ? <FiTrendingUp /> : stock.change < 0 ? <FiTrendingDown /> : <FiActivity />}
                                    <span>{stock.change > 0 ? '+' : ''}{formatNumberEnIn(stock.changePercent)}%</span>
                                </div>

                            </div>
                        </div>
                        
                        <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 pt-6 md:pt-6 border-t border-white/10">
                            <div>
                                <p className="text-indigo-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Day High</p>
                                <p className="text-xs md:text-lg font-black text-white truncate">₹{formatNumberEnIn(stock.dayHigh)}</p>
                            </div>
                            <div>
                                <p className="text-indigo-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Day Low</p>
                                <p className="text-xs md:text-lg font-black text-white truncate">₹{formatNumberEnIn(stock.dayLow)}</p>
                            </div>
                            <div>
                                <p className="text-indigo-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Volume</p>
                                <p className="text-xs md:text-lg font-black text-white truncate">{stock.volume}</p>
                            </div>
                            <div>
                                <p className="text-indigo-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Mkt Cap</p>
                                <p className="text-xs md:text-lg font-black text-white truncate">{stock.marketCap}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-100/30 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <FiActivity className="text-lg" />
                                </div>
                                <span className="text-indigo-950 font-black text-lg tracking-tight uppercase">Quick Overview</span>
                            </div>
                            <p className="text-indigo-900/60 leading-relaxed font-medium text-[11px] md:text-sm">
                                {stock.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-8 md:mb-12">
                <div className="bg-white/40 backdrop-blur-md rounded-[1.5rem] md:rounded-[2.5rem] p-0 border border-white/50 shadow-sm overflow-hidden">
                    <PriceHistoryChart
                        history={stock.history || []}
                        color={stock.change > 0 ? "#10B981" : stock.change < 0 ? "#F43F5E" : "#F59E0B"}
                        title={`${stock.symbol} Price History`}
                    />

                </div>
            </div>

            <div className="mb-8 md:mb-12">
                <SectionTitle icon={<FiBarChart2 />} title="Financial Metrics" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {displayMetrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-4 md:p-6 rounded-[1.25rem] md:rounded-3xl border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[110px] md:min-h-[140px]"
                        >
                            <div className="flex justify-between items-start mb-2 md:mb-3">
                                <div className="text-indigo-400 text-lg md:text-xl group-hover:text-indigo-600 transition-colors">
                                    {metric.icon}
                                </div>
                                <MetricInfo metricKey={metric.label} />
                            </div>
                            <div>
                                <p className="text-indigo-900/50 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1 truncate">{metric.label}</p>
                                <p className="text-sm md:text-lg font-black text-indigo-950 truncate">
                                    {formatMetricCell(metric.value as string | number, metric.suffix)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8 md:mb-12">
                <SectionTitle icon={<FiCheckCircle />} title="Pros & Cons" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-50/50 overflow-hidden">
                        <div className="px-5 md:px-6 py-3 md:py-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-600 text-base md:text-lg" />
                            <span className="text-[11px] md:text-xs font-black text-emerald-700 uppercase tracking-widest">Pros</span>
                        </div>
                        <ul className="divide-y divide-emerald-50/60">
                            {(stock.pros || []).map((pro, i) => (
                                <li key={i} className="flex items-start gap-3 px-5 md:px-6 py-3 md:py-3.5 hover:bg-emerald-50/30 transition-colors">
                                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                    <span className="text-[11px] md:text-sm font-medium text-indigo-900/80 leading-relaxed">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-3xl border border-rose-100 shadow-xl shadow-rose-50/50 overflow-hidden">
                        <div className="px-5 md:px-6 py-3 md:py-4 bg-rose-50/60 border-b border-rose-100 flex items-center gap-2">
                            <FiAlertCircle className="text-rose-500 text-base md:text-lg" />
                            <span className="text-[11px] md:text-xs font-black text-rose-600 uppercase tracking-widest">Cons</span>
                        </div>
                        <ul className="divide-y divide-rose-50/60">
                            {(stock.cons || []).map((con, i) => (
                                <li key={i} className="flex items-start gap-3 px-5 md:px-6 py-3 md:py-3.5 hover:bg-rose-50/30 transition-colors">
                                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                                    <span className="text-[11px] md:text-sm font-medium text-indigo-900/80 leading-relaxed">{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <QuarterlyResultsSection stock={stock} />
            <ProfitLossSection stock={stock} />
            <BalanceSheetSection stock={stock} />
            <CashFlowSection stock={stock} />
            <ShareholdingSection stock={stock} />

            <RevenueMixSection
                revenueMix={stock.revenueMix}
                locationBreakup={stock.locationBreakup}
                productBreakup={stock.productBreakup}
            />

            <PeerComparisonSection peers={stock.peers} currentSymbol={stock.symbol} />

            <CorporateActionsSection
                corporateActions={stock.corporateActions}
                suppliers={stock.suppliers}
            />

            <DocumentsSection
                annualReportUrl={stock.annualReportUrl}
                investorPresentationUrl={stock.investorPresentationUrl}
                earningsReleaseUrl={stock.earningsReleaseUrl}
                conferenceCallUrl={stock.conferenceCallUrl}
                conferenceCallSummary={stock.conferenceCallSummary}
                companyName={stock.name}
            />

            <AnalysisViewsSection
                shortTermView={stock.shortTermView}
                longTermView={stock.longTermView}
                fundamentalsScore={stock.fundamentalsScore}
                valuationScore={stock.valuationScore}
                currentPrice={stock.price}
                fairValue={stock.fairValue}
            />
        </PageShell>
    );
};

export default StockDetails;
