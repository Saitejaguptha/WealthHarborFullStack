import React from 'react';
import { FiPieChart, FiLayout } from 'react-icons/fi';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface Holding {
    company: string;
    sector?: string;
    allocation: number;
}

interface SectorAlloc {
    sector: string;
    percentage: number;
}

interface Props {
    topHoldings: Holding[];
    sectorAllocation: SectorAlloc[];
    title?: string;
}

const FundHoldingsSection: React.FC<Props> = ({ topHoldings, sectorAllocation, title = "Portfolio Analysis" }) => {
    return (
        <div className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-6 tracking-tight flex items-center gap-2 md:gap-3">
                <span className="text-indigo-400 text-xl md:text-2xl shrink-0"><FiPieChart /></span>
                <span className="break-words line-clamp-2">{title}</span>
                <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
                {/* Top Holdings */}
                <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 overflow-hidden min-w-0 max-w-full">
                    <div className="px-4 sm:px-6 py-4 bg-indigo-50/40 border-b border-indigo-50">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top Holdings</span>
                    </div>
                    {/* Mobile: stacked rows — no horizontal scroll */}
                    <ul className="md:hidden divide-y divide-indigo-50">
                        {topHoldings.map((h, i) => (
                            <li key={i} className="px-4 py-3.5 hover:bg-indigo-50/20 transition-colors">
                                <div className="flex items-start justify-between gap-3 min-w-0">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-indigo-950 leading-snug break-words">{h.company}</p>
                                        {h.sector && (
                                            <p className="text-[11px] font-medium text-indigo-900/60 mt-1 break-words">{h.sector}</p>
                                        )}
                                    </div>
                                    <span className="text-sm font-black text-indigo-950 tabular-nums shrink-0">{formatNumberEnIn(h.allocation)}%</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="hidden md:block w-full overflow-x-auto scrollbar-thin pb-2">
                        <table className="w-full text-sm min-w-max border-collapse">
                            <thead>
                                <tr className="border-b border-indigo-50 bg-indigo-50/20">
                                    <th className="text-left px-4 md:px-6 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[120px]">Company</th>
                                    {topHoldings[0]?.sector && (
                                        <th className="text-left px-4 md:px-6 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[100px]">Sector</th>
                                    )}
                                    <th className="text-right px-4 md:px-6 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[80px]">Alloc (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topHoldings.map((h, i) => (
                                    <tr key={i} className="border-b border-indigo-50/50 hover:bg-indigo-50/20 transition-colors">
                                        <td className="px-6 py-3.5 text-xs font-bold text-indigo-950">{h.company}</td>
                                        {h.sector && (
                                            <td className="px-6 py-3.5 text-[11px] font-medium text-indigo-900/60">{h.sector}</td>
                                        )}
                                        <td className="px-6 py-3.5 text-sm font-black text-indigo-950 text-right">{formatNumberEnIn(h.allocation)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sector Allocation Bar Chart */}
                <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-4 sm:p-6 flex flex-col justify-between min-w-0 max-w-full">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <FiLayout className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sector Allocation</span>
                        </div>
                        <div className="space-y-5">
                            {sectorAllocation.map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end gap-2 min-w-0">
                                        <span className="text-xs font-bold text-indigo-950 min-w-0 break-words">{s.sector}</span>
                                        <span className="text-xs font-black text-indigo-600 shrink-0 tabular-nums">{formatNumberEnIn(s.percentage)}%</span>
                                    </div>
                                    <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${s.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-indigo-50">
                        <p className="text-[10px] text-indigo-900/40 italic">* Data as of latest available portfolio disclosure.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundHoldingsSection;
