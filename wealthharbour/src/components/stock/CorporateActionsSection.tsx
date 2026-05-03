import React from 'react';
import { FiCalendar, FiTruck } from 'react-icons/fi';
import type { CorporateAction, Supplier } from '../../types/stock';

interface Props {
    corporateActions: CorporateAction[];
    suppliers: Supplier[];
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-4 md:mb-6 tracking-tight flex items-center gap-2 md:gap-3">
        <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
        <span className="break-words line-clamp-2">{title}</span>
        <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
    </h2>
);

const ACTION_COLORS: Record<CorporateAction['type'], string> = {
    Dividend: 'bg-emerald-100 text-emerald-700',
    Bonus:    'bg-indigo-100 text-indigo-700',
    Split:    'bg-violet-100 text-violet-700',
    Rights:   'bg-amber-100 text-amber-700',
    Buyback:  'bg-rose-100 text-rose-600',
};

const CorporateActionsAndSuppliers: React.FC<Props> = ({ corporateActions, suppliers }) => (
    <>
        {/* Corporate Actions */}
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiCalendar />} title="Corporate Actions" />
            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 overflow-hidden">
                {/* Mobile: vertical list — no horizontal scroll */}
                <ul className="md:hidden divide-y divide-indigo-50">
                    {corporateActions.map((action, i) => (
                        <li key={i} className="p-4 hover:bg-indigo-50/20 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-indigo-900/60">{action.date}</span>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${ACTION_COLORS[action.type]}`}>
                                    {action.type}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-indigo-900/70 leading-relaxed">{action.details}</p>
                            <p className="text-sm font-black text-indigo-950 mt-2 tabular-nums">{action.amount || '—'}</p>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-200 pb-2">
                    <table className="w-full text-sm min-w-max">
                        <thead>
                            <tr className="border-b border-indigo-50 bg-indigo-50/40">
                                <th className="text-left px-3 md:px-5 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[70px] md:min-w-[100px]">Date</th>
                                <th className="text-left px-3 md:px-5 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[60px] md:min-w-[80px]">Type</th>
                                <th className="text-left px-3 md:px-5 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[140px] md:min-w-[200px]">Details</th>
                                <th className="text-right px-3 md:px-5 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[70px] md:min-w-[100px]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {corporateActions.map((action, i) => (
                                <tr key={i} className="border-b border-indigo-50/50 hover:bg-indigo-50/20 transition-colors">
                                    <td className="px-5 py-3.5 text-xs font-bold text-indigo-900/60 whitespace-nowrap">{action.date}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${ACTION_COLORS[action.type]}`}>
                                            {action.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs font-medium text-indigo-900/70">{action.details}</td>
                                    <td className="px-5 py-3.5 text-sm font-black text-indigo-950 text-right whitespace-nowrap">{action.amount || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Suppliers */}
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiTruck />} title="Key Suppliers" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-indigo-50 shadow-lg shadow-indigo-50 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <FiTruck className="text-lg" />
                            </div>
                            <span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-500 rounded-full">{s.country}</span>
                        </div>
                        <h4 className="text-sm font-black text-indigo-950 mb-1 leading-tight">{s.name}</h4>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">{s.category}</p>
                        <p className="text-xs font-medium text-indigo-900/60">{s.relationship}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
);

export default CorporateActionsAndSuppliers;
