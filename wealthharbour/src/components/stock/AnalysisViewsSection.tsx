import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiStar } from 'react-icons/fi';
import type { InvestmentView } from '../../types/stock';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface Props {
    shortTermView: InvestmentView;
    longTermView: InvestmentView;
    fundamentalsScore: number;
    valuationScore: number;
    currentPrice: number;
    fairValue: number;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-4 md:mb-6 tracking-tight flex items-center gap-2 md:gap-3">
        <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
        <span className="truncate min-w-0">{title}</span>
        <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
    </h2>
);

const OUTLOOK_CONFIG = {
    Bullish: { icon: <FiTrendingUp />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-600 text-white' },
    Bearish: { icon: <FiTrendingDown />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', badge: 'bg-rose-600 text-white' },
    Neutral: { icon: <FiMinus />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-500 text-white' },
};

const ViewCard: React.FC<{ view: InvestmentView; currentPrice: number }> = ({ view, currentPrice }) => {
    const cfg = OUTLOOK_CONFIG[view.outlook];
    const upside = formatNumberEnIn(((view.targetPrice - currentPrice) / currentPrice) * 100);
    const isUp = view.targetPrice >= currentPrice;

    return (
        <div className={`bg-white rounded-3xl border ${cfg.border} shadow-xl shadow-indigo-50 overflow-hidden`}>
            <div className={`px-4 sm:px-6 py-4 ${cfg.bg} border-b ${cfg.border} flex items-center justify-between gap-3 min-w-0`}>
                <div className="min-w-0 flex-1">
                    <span className={`text-[8px] md:text-[10px] font-black px-2 md:px-2.5 py-0.5 md:py-1 rounded-full ${cfg.badge} uppercase tracking-widest`}>
                        {view.outlook}
                    </span>
                    <p className="text-xs md:text-sm font-black text-indigo-950 mt-1.5 md:mt-2">{view.term} View</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{view.timeframe}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Target Price</p>
                    <p className="text-2xl font-black text-indigo-950">₹{formatNumberEnIn(view.targetPrice)}</p>
                    <p className={`text-xs font-black ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isUp ? '+' : ''}{upside}% upside
                    </p>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <p className="text-xs md:text-sm font-medium text-indigo-900/70 leading-relaxed mb-4 md:mb-5">{view.rationale}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Key Drivers</p>
                        <ul className="space-y-1.5">
                            {view.keyDrivers.map((d, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-medium text-indigo-900/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Key Risks</p>
                        <ul className="space-y-1.5">
                            {view.keyRisks.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-medium text-indigo-900/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScoreGauge: React.FC<{ score: number; label: string; description: string }> = ({ score, label, description }) => {
    const pct = score / 100;
    const color = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#F43F5E';
    const label2 = score >= 70 ? 'Strong' : score >= 45 ? 'Moderate' : 'Weak';
    const R = 60, CX = 80, CY = 80;
    const circumference = Math.PI * R; // half circle
    const offset = circumference * (1 - pct);

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 p-5 md:p-6 flex flex-col items-center min-w-0 max-w-full">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">{label}</p>
            <div className="relative scale-90 md:scale-100">
                <svg width={160} height={100} viewBox="0 0 160 100">
                    <path d={`M 20,80 A 60,60 0 0,1 140,80`} fill="none" stroke="#EEF2FF" strokeWidth="14" strokeLinecap="round" />
                    <path d={`M 20,80 A 60,60 0 0,1 140,80`} fill="none" stroke={color} strokeWidth="14"
                        strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    <text x={CX} y={CY - 5} textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e1b4b">{score}</text>
                    <text x={CX} y={CY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{label2.toUpperCase()}</text>
                </svg>
            </div>
            <p className="text-xs font-medium text-indigo-900/60 text-center mt-2 leading-relaxed">{description}</p>
        </div>
    );
};

const FairValueBreakup: React.FC<{ currentPrice: number; fairValue: number }> = ({ currentPrice, fairValue }) => {
    const discount = fairValue > 0 ? formatNumberEnIn(((fairValue - currentPrice) / fairValue) * 100) : '0';
    const pctFilled = Math.min((currentPrice / fairValue) * 100, 150);
    const overvalued = currentPrice > fairValue;

    return (
        <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-5 md:p-6 h-full flex flex-col justify-between min-w-0 max-w-full overflow-hidden">
            <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-5">Current Price vs Fair Value</p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="w-full sm:flex-1 text-center sm:text-left">
                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Current Price</p>
                        <p className="text-xl md:text-2xl font-black text-indigo-950">₹{formatNumberEnIn(currentPrice)}</p>
                    </div>
                    <div className={`shrink-0 px-3 py-1.5 rounded-xl ${overvalued ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1">{overvalued ? 'Overvalued' : 'Undervalued'}</p>
                        <p className="text-base font-black leading-none">{overvalued ? '+' : '-'}{Math.abs(Number(discount))}%</p>
                    </div>
                    <div className="w-full sm:flex-1 text-center sm:text-right">
                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Fair Value</p>
                        <p className="text-xl md:text-2xl font-black text-indigo-950">₹{formatNumberEnIn(fairValue)}</p>
                    </div>
                </div>

                {/* Visual bar */}
                <div className="relative h-2.5 md:h-3 bg-indigo-50 rounded-full overflow-hidden mb-2">
                    <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(pctFilled, 100)}%`, backgroundColor: overvalued ? '#F43F5E' : '#10B981' }} />
                    {/* Fair Value marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 opacity-40" style={{ left: '66.6%' }} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 text-[6px] md:text-[7px] font-black text-indigo-400 uppercase tracking-widest px-0.5 sm:flex-row sm:justify-between sm:items-center sm:gap-2">
                    <span className="shrink-0 order-2 sm:order-1">₹0</span>
                    <span className="text-indigo-600 text-center break-words leading-snug order-1 sm:order-2 min-w-0 sm:flex-1 sm:px-1">
                        Fair Value: ₹{formatNumberEnIn(fairValue)}
                    </span>
                    <span className="shrink-0 text-right order-3 sm:text-left">₹{formatNumberEnIn(fairValue * 1.5, 0)}</span>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: 'Intrinsic Value', value: `₹${formatNumberEnIn(fairValue)}` },
                    { label: 'Margin of Safety', value: overvalued ? 'None' : `${discount}%` },
                    { label: 'Analyst Target', value: `₹${formatNumberEnIn(fairValue * 1.05, 0)}` },
                ].map((item, i) => (
                    <div key={i} className="text-center p-3 bg-indigo-50/50 rounded-xl">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-black text-indigo-950 mt-0.5">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AnalysisViewsSection: React.FC<Props> = ({ shortTermView, longTermView, fundamentalsScore, valuationScore, currentPrice, fairValue }) => (
    <>
        {/* Investment Views */}
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiTrendingUp />} title="Investment Views" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ViewCard view={shortTermView} currentPrice={currentPrice} />
                <ViewCard view={longTermView} currentPrice={currentPrice} />
            </div>
        </div>

        {/* Scores + Fair Value */}
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiStar />} title="Scores & Valuation" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
                <div className="flex flex-col gap-6 min-w-0">
                    <ScoreGauge
                        score={fundamentalsScore}
                        label="Fundamentals Score"
                        description="Evaluates earnings quality, balance sheet strength, and cash flow."
                    />
                </div>
                <div className="flex flex-col gap-6 min-w-0">
                    <ScoreGauge
                        score={valuationScore}
                        label="Valuation Score"
                        description="Compares vs historical ranges, peers, and intrinsic value."
                    />
                </div>
                <div className="md:col-span-2 xl:col-span-1 min-w-0">
                    <FairValueBreakup currentPrice={currentPrice} fairValue={fairValue} />
                </div>
            </div>
        </div>
    </>
);

export default AnalysisViewsSection;
