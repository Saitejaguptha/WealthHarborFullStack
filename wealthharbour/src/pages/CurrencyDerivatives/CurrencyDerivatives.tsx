import React, { useState, useEffect, useMemo } from 'react';
import PageShell from '../../components/layout/PageShell';
import BeginnerGuide from '../../components/common/BeginnerGuide';
import { FiGlobe, FiActivity, FiFilter, FiRepeat, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { DerivativeService } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface CurrencyData {
    pair: string;
    price: string;
    change: string;
    trend: string;
    history?: { date: string; price: number }[];
    volume?: number;
    share?: number;
}

const CurrencyDerivatives: React.FC = () => {
    // Beginner guide content
    const guideSteps = [
        { title: 'The Global Exchange', description: 'Currency derivatives are contracts where you trade based on the future direction of exchange rates (e.g. USD vs INR).' },
        { title: 'Hedging Risk', description: 'Businesses use these to protect themselves from losing money if currency values change unexpectedly.' },
        { title: 'Standard Pairs', description: 'In India, the most popular pairs are USD/INR, EUR/INR, GBP/INR, and JPY/INR.' },
        { title: 'Lot Sizes', description: 'Currency is traded in "lots". One lot of USD/INR is typically $1,000. You don’t need the full $1,000 to trade; you only need a small margin.' },
        { title: 'High Liquidity', description: 'The currency market is the largest and most liquid market in the world, allowing for fast trades.' }
    ];

    const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedPair, setSelectedPair] = useState('All');

    // Converter State
    const [amount, setAmount] = useState<number>(1);
    const [fromCurr, setFromCurr] = useState('USD');
    const [toCurr, setToCurr] = useState('INR');
    const [rates, setRates] = useState<Record<string, number>>({});

    useEffect(() => {
        setIsLoading(true);
        DerivativeService.getCurrencyPairs({ startDate: fromDate, endDate: toDate, pair: selectedPair })
            .then((data: CurrencyData[]) => {
                if (data) setCurrencies(data);
                setIsLoading(false);
            });
        
        DerivativeService.getConversionRates().then(data => {
            if (data) setRates(data);
        });
    }, [fromDate, toDate, selectedPair]);

    const convertedAmount = useMemo(() => {
        if (!rates[fromCurr] || !rates[toCurr]) return 0;
        const inBase = amount * rates[fromCurr];
        return (inBase / rates[toCurr]).toFixed(2);
    }, [amount, fromCurr, toCurr, rates]);

    const pieData = useMemo(() => {
        return currencies.map(c => ({
            name: c.pair,
            value: c.share || 0
        }));
    }, [currencies]);

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <PageShell className="animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-indigo-50 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-indigo-950 flex items-center gap-3">
                        <FiGlobe className="text-indigo-600" /> Currency Derivatives
                    </h1>
                    <p className="text-indigo-900/50 mt-2 font-medium">Hedge against exchange rate fluctuations with currency futures and options.</p>
                </div>
                <div className="flex items-center gap-4">
                    <BeginnerGuide 
                        title="Currency Derivatives"
                        description="Currency derivatives are financial instruments whose value is derived from the exchange rate of two or more currencies."
                        steps={guideSteps}
                        color="indigo"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Converter Tool */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <FiRepeat className="text-indigo-200" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Currency Converter</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-indigo-200 ml-1">Amount</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-lg font-black text-white focus:ring-2 focus:ring-white/20 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-black uppercase text-indigo-200 ml-1">From</label>
                                <select 
                                    value={fromCurr}
                                    onChange={(e) => setFromCurr(e.target.value)}
                                    className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-white/20 outline-none"
                                >
                                    {Object.keys(rates).map(c => <option key={c} value={c} className="text-indigo-900">{c}</option>)}
                                </select>
                            </div>
                            <div className="pt-5"><FiRepeat className="text-indigo-300" /></div>
                            <div className="flex-1">
                                <label className="text-[10px] font-black uppercase text-indigo-200 ml-1">To</label>
                                <select 
                                    value={toCurr}
                                    onChange={(e) => setToCurr(e.target.value)}
                                    className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-white/20 outline-none"
                                >
                                    {Object.keys(rates).map(c => <option key={c} value={c} className="text-indigo-900">{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 bg-white/10 p-6 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Converted Value</p>
                            <div className="text-3xl font-black">{convertedAmount} <span className="text-sm font-bold text-indigo-200">{toCurr}</span></div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="lg:col-span-2 bg-white border border-indigo-50 p-8 rounded-3xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <FiFilter className="text-indigo-600" />
                            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Market Filters</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-1">Currency Pair</label>
                                <select 
                                    className="bg-indigo-50/50 border-none rounded-xl px-4 py-3 text-sm font-bold text-indigo-950 outline-none"
                                    value={selectedPair}
                                    onChange={(e) => setSelectedPair(e.target.value)}
                                >
                                    <option value="All">All Pairs</option>
                                    <option value="USD/INR">USD/INR</option>
                                    <option value="EUR/INR">EUR/INR</option>
                                    <option value="GBP/INR">GBP/INR</option>
                                    <option value="JPY/INR">JPY/INR</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-1">From Date</label>
                                <input 
                                    type="date" 
                                    className="bg-indigo-50/50 border-none rounded-xl px-4 py-3 text-sm font-bold text-indigo-950 outline-none"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-1">To Date</label>
                                <input 
                                    type="date" 
                                    className="bg-indigo-50/50 border-none rounded-xl px-4 py-3 text-sm font-bold text-indigo-950 outline-none"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                        <div className="bg-emerald-500 p-2 rounded-lg"><FiActivity className="text-white" /></div>
                        <p className="text-xs font-bold text-emerald-900/70">The currency market is currently active. Trades are being executed in real-time across global exchanges.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Bar Chart */}
                <div className="bg-white border border-indigo-50 p-8 rounded-3xl shadow-sm">
                    <div className="mb-8 flex items-center gap-3">
                        <FiBarChart2 className="text-indigo-600" />
                        <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Trading Volume</h2>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] min-w-[100px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={currencies}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="pair" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                                <RechartsTooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="volume" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white border border-indigo-50 p-8 rounded-3xl shadow-sm">
                    <div className="mb-8 flex items-center gap-3">
                        <FiPieChart className="text-indigo-600" />
                        <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Market Share</h2>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] min-w-[100px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-indigo-50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/5">
                <div className="overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full text-left min-w-max">

                    <thead className="bg-indigo-50/50 text-indigo-400 text-[11px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Currency Pair</th>
                            <th className="px-8 py-5">Current Price</th>
                            <th className="px-8 py-5">24h Change</th>
                            <th className="px-8 py-5 text-right">Volume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-50/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-10 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : currencies.map((curr, idx) => (
                            <tr key={idx} className="hover:bg-indigo-50/20 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-black text-indigo-950">{curr.pair}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-indigo-900">{curr.price}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`font-bold flex items-center gap-2 ${curr.trend === 'Up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <FiActivity className={curr.trend === 'Down' ? 'rotate-180' : ''} />
                                        {curr.change}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="font-bold text-indigo-900/50">{curr.volume?.toLocaleString()}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </PageShell>
    );
};

export default CurrencyDerivatives;


