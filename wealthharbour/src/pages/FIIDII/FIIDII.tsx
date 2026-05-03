import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrendingUp, FiTrendingDown, FiCalendar, FiUsers, FiFilter } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import InstitutionalActivityChart from '../../components/common/InstitutionalActivityChart';
import { formatNumberEnIn } from '../../utils/numberFormat';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { GuideService } from '../../services/api';
import { fetchInstitutionalActivity } from '../../store/slices/institutionalSlice';
import type { InstitutionalData } from '../../store/slices/institutionalSlice';
import type { AppDispatch, RootState } from '../../store';

const FIIDII: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { activity: data, isLoading } = useSelector((state: RootState) => state.institutional);
    const [guide, setGuide] = useState<any>(null);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const loadGuide = async () => {
            const guideData = await GuideService.getGuide('institutional');
            if (guideData) setGuide(guideData);
        };
        loadGuide();
    }, []);

    useEffect(() => {
        dispatch(fetchInstitutionalActivity({ startDate: fromDate, endDate: toDate }));
    }, [dispatch, fromDate, toDate]);

    const totals = useMemo(() => {
        return data.reduce((acc, curr) => ({
            fii: acc.fii + curr.fiiNet,
            dii: acc.dii + curr.diiNet,
            total: acc.total + curr.totalNet
        }), { fii: 0, dii: 0, total: 0 });
    }, [data]);

    const pieData = [
        { name: 'FII Net Total', value: Math.abs(totals.fii), color: '#4f46e5' },
        { name: 'DII Net Total', value: Math.abs(totals.dii), color: '#10b981' }
    ];

    return (
        <PageShell className="animate-in fade-in duration-700 pb-32">
            <PageHeader 
                title="Institutional Activity"
                subtitle="Track FII & DII investment flows in the Indian market"
                icon={<FiUsers className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {/* Date Filters */}
            <div className="bg-white/50 backdrop-blur-md border border-indigo-50 p-8 rounded-[2rem] mb-12 flex flex-wrap items-center gap-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiFilter />
                    </div>
                    <span className="font-black text-indigo-950 text-xs uppercase tracking-widest">Timeframe Intelligence</span>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-1">Analysis From</label>
                        <input 
                            type="date" 
                            className="bg-white border-2 border-indigo-50 rounded-xl px-5 py-3 text-sm font-black text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-1">Analysis To</label>
                        <input 
                            type="date" 
                            className="bg-white border-2 border-indigo-50 rounded-xl px-5 py-3 text-sm font-black text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Aggregating Institutional Flows...</p>
                </div>
            ) : data.length > 0 ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
                                <div className="bg-white border border-indigo-50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-2">Cumulative FII</p>
                                    <div className={`flex items-center gap-2 text-2xl font-black ${totals.fii >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {totals.fii >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                                        ₹{formatNumberEnIn(Math.abs(totals.fii))} <span className="text-xs font-black text-indigo-900/30 mt-1 uppercase">Cr</span>
                                    </div>
                                </div>
                                <div className="bg-white border border-indigo-50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-2">Cumulative DII</p>
                                    <div className={`flex items-center gap-2 text-2xl font-black ${totals.dii >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {totals.dii >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                                        ₹{formatNumberEnIn(Math.abs(totals.dii))} <span className="text-xs font-black text-indigo-900/30 mt-1 uppercase">Cr</span>
                                    </div>
                                </div>
                                <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-100">
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Net Ecosystem Flow</p>
                                    <div className="text-2xl font-black text-white">
                                        ₹{formatNumberEnIn(totals.total)} <span className="text-xs font-black text-white/60 mt-1 uppercase">Cr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-indigo-50 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                                <div className="mb-10">
                                    <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Institutional Velocity</h2>
                                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mt-1">Movement analysis over selected period</p>
                                </div>
                                <div className="h-[400px]">
                                    <InstitutionalActivityChart 
                                        data={data.map((d: InstitutionalData) => ({
                                            date: d.date,
                                            fiiNet: d.fiiNet,
                                            diiNet: d.diiNet
                                        }))}
                                        title=""
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white border border-indigo-50 p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                             <div className="mb-10 self-start">
                                <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight text-left">Market Presence</h2>
                                <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mt-1 text-left">Flow share distribution</p>
                            </div>
                            <div className="h-[300px] w-full min-h-[300px] min-w-[100px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'white', 
                                                border: 'none', 
                                                borderRadius: '1rem', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                padding: '1rem'
                                            }}
                                            itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            iconType="circle"
                                            wrapperStyle={{ paddingTop: '2rem', fontWeight: 'black', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-10 text-center bg-indigo-50 p-6 rounded-2xl w-full border border-indigo-100/50">
                                <p className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Sentiment Indicator</p>
                                <p className="text-sm font-black text-indigo-950 leading-relaxed">
                                    {totals.fii > totals.dii ? 'Foreign Capital' : 'Domestic Capital'} is the primary liquidity architect in this window.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-indigo-50 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <div className="px-10 py-8 border-b border-indigo-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Ledger of Transactions</h2>
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                <FiCalendar /> Daily Records
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-indigo-50/30">
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">Date</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">FII (Cr)</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">DII (Cr)</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">Net Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50/50">
                                    {/* ─── Aggregate Totals Row — pinned at top ─── */}
                                    <tr className="bg-indigo-950">
                                        <td className="px-10 py-6 font-black text-white uppercase text-[10px] tracking-widest">
                                            Aggregate Ecosystem Flow
                                        </td>
                                        <td className={`px-10 py-6 text-right font-black text-sm ${totals.fii >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {totals.fii > 0 ? '+' : ''}{formatNumberEnIn(totals.fii)}
                                        </td>
                                        <td className={`px-10 py-6 text-right font-black text-sm ${totals.dii >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {totals.dii > 0 ? '+' : ''}{formatNumberEnIn(totals.dii)}
                                        </td>
                                        <td className={`px-10 py-6 text-right font-black text-sm ${totals.total >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {totals.total > 0 ? '+' : ''}{formatNumberEnIn(totals.total)}
                                        </td>
                                    </tr>
                                    {/* ─── Daily Rows ─── */}
                                    {data.map((row: InstitutionalData, idx: number) => (
                                        <tr key={idx} className="hover:bg-indigo-50/20 transition-colors group">
                                            <td className="px-10 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                        <FiCalendar />
                                                    </div>
                                                    <span className="font-black text-indigo-950 text-sm">{row.date}</span>
                                                </div>
                                            </td>
                                            <td className={`px-10 py-5 text-right font-black text-sm ${row.fiiNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {row.fiiNet > 0 ? '+' : ''}{formatNumberEnIn(row.fiiNet)}
                                            </td>
                                            <td className={`px-10 py-5 text-right font-black text-sm ${row.diiNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {row.diiNet > 0 ? '+' : ''}{formatNumberEnIn(row.diiNet)}
                                            </td>
                                            <td className={`px-10 py-5 text-right font-black text-sm ${row.totalNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {row.totalNet > 0 ? '+' : ''}{formatNumberEnIn(row.totalNet)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200">
                    <div className="text-6xl mb-6 opacity-10">📉</div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">No Intelligence Found</h3>
                    <p className="text-indigo-900/40 font-medium mt-2">Adjust timeframe to reveal institutional patterns</p>
                </div>
            )}
        </PageShell>
    );
};

export default FIIDII;

