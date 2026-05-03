import React from 'react';
import { FiPlusCircle, FiMinusCircle, FiTrendingUp, FiTrendingDown, FiPieChart, FiActivity } from 'react-icons/fi';
import SectionTitle from './SectionTitle';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface PortfolioHolding {
    name: string;
    weightage: number;
    sector?: string;
    change?: number;
}

interface PortfolioChanges {
    newlyAdded: PortfolioHolding[];
    removed: PortfolioHolding[];
    increased: PortfolioHolding[];
    decreased: PortfolioHolding[];
}

interface PortfolioAnalysisProps {
    holdings: PortfolioHolding[];
    changes?: PortfolioChanges;
    title?: string;
}

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({ holdings, changes, title = "Portfolio Analysis" }) => {
    return (
        <div className="space-y-12 mt-20">
            {/* Top Holdings Table */}
            <div>
                <SectionTitle icon={<FiPieChart />} title={title} />
                <div className="bg-white rounded-[2.5rem] border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-indigo-50/40 border-b border-indigo-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Company / Holding</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sector</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-400 uppercase tracking-widest text-right">Weightage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-50/50">
                                {holdings.map((h, i) => (
                                    <tr key={i} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-black text-indigo-950 group-hover:text-indigo-600 transition-colors">{h.name}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-indigo-900/50 uppercase tracking-tight">{h.sector || 'N/A'}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-indigo-950">{h.weightage}%</span>
                                                <div className="w-24 h-1.5 bg-indigo-50 rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-indigo-600" style={{ width: `${h.weightage}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Portfolio Changes Grid */}
            {changes && (
                <div>
                    <SectionTitle icon={<FiActivity />} title="Recent Portfolio Changes" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Newly Added */}
                        <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-50/50 overflow-hidden">
                            <div className="px-6 py-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center gap-2">
                                <FiPlusCircle className="text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Newly Added</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {changes.newlyAdded.length > 0 ? changes.newlyAdded.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-emerald-50/30 rounded-xl border border-emerald-50">
                                        <span className="text-xs font-black text-indigo-950 truncate max-w-[120px]">{h.name}</span>
                                        <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-1 rounded-lg">+{h.weightage}%</span>
                                    </div>
                                )) : <p className="text-[10px] text-indigo-300 font-bold uppercase text-center py-4">No new additions</p>}
                            </div>
                        </div>

                        {/* Removed */}
                        <div className="bg-white rounded-3xl border border-rose-100 shadow-lg shadow-rose-50/50 overflow-hidden">
                            <div className="px-6 py-4 bg-rose-50/60 border-b border-rose-100 flex items-center gap-2">
                                <FiMinusCircle className="text-rose-600" />
                                <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Removed</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {changes.removed.length > 0 ? changes.removed.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-rose-50/30 rounded-xl border border-rose-50">
                                        <span className="text-xs font-black text-indigo-950 truncate max-w-[120px]">{h.name}</span>
                                        <span className="text-[10px] font-black text-rose-600 bg-white px-2 py-1 rounded-lg">Sold Out</span>
                                    </div>
                                )) : <p className="text-[10px] text-indigo-300 font-bold uppercase text-center py-4">No removals</p>}
                            </div>
                        </div>

                        {/* Increased Weight */}
                        <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50/50 overflow-hidden">
                            <div className="px-6 py-4 bg-indigo-50/60 border-b border-indigo-100 flex items-center gap-2">
                                <FiTrendingUp className="text-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Increased</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {changes.increased.length > 0 ? changes.increased.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-indigo-50/30 rounded-xl border border-indigo-50">
                                        <span className="text-xs font-black text-indigo-950 truncate max-w-[120px]">{h.name}</span>
                                        <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                                            <FiTrendingUp size={10} /> {h.change}%
                                        </span>
                                    </div>
                                )) : <p className="text-[10px] text-indigo-300 font-bold uppercase text-center py-4">No increases</p>}
                            </div>
                        </div>

                        {/* Decreased Weight */}
                        <div className="bg-white rounded-3xl border border-amber-100 shadow-lg shadow-amber-50/50 overflow-hidden">
                            <div className="px-6 py-4 bg-amber-50/60 border-b border-amber-100 flex items-center gap-2">
                                <FiTrendingDown className="text-amber-600" />
                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Decreased</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {changes.decreased.length > 0 ? changes.decreased.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-amber-50/30 rounded-xl border border-amber-50">
                                        <span className="text-xs font-black text-indigo-950 truncate max-w-[120px]">{h.name}</span>
                                        <span className="text-[10px] font-black text-rose-500 flex items-center gap-1">
                                            <FiTrendingDown size={10} /> {h.change}%
                                        </span>
                                    </div>
                                )) : <p className="text-[10px] text-indigo-300 font-bold uppercase text-center py-4">No decreases</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioAnalysis;
