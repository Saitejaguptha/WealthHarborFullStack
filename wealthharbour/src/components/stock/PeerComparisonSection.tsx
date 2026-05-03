import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import type { PeerCompany } from '../../types/stock';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface Props {
    peers: PeerCompany[];
    currentSymbol: string;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-4 md:mb-6 tracking-tight flex items-center gap-2 md:gap-3">
        <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
        <span className="truncate min-w-0">{title}</span>
        <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
    </h2>
);

const PeerComparisonSection: React.FC<Props> = ({ peers, currentSymbol }) => {
    const cols: { key: keyof PeerCompany; label: string; fmt?: (v: PeerCompany[keyof PeerCompany]) => string }[] = [
        { key: 'name',          label: 'Company' },
        { key: 'price',         label: 'Price (₹)',     fmt: v => `₹${formatNumberEnIn(Number(v))}` },
        { key: 'marketCap',     label: 'Mkt Cap' },
        { key: 'peRatio',       label: 'P/E',           fmt: v => formatNumberEnIn(Number(v)) },
        { key: 'roe',           label: 'ROE %',         fmt: v => `${formatNumberEnIn(Number(v))}%` },
        { key: 'roce',          label: 'ROCE %',        fmt: v => `${formatNumberEnIn(Number(v))}%` },
        { key: 'dividendYield', label: 'Div. Yield %',  fmt: v => `${formatNumberEnIn(Number(v))}%` },
    ];

    const metricCols = cols.filter(c => c.key !== 'name');

    return (
        <div className="mb-6 md:mb-12">
            <SectionTitle icon={<FiBarChart2 />} title="Peer Comparison" />
            <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                {/* Mobile: stacked cards — no horizontal scroll */}
                <div className="md:hidden divide-y divide-indigo-50 p-1">
                    {peers.map((peer, i) => {
                        const isCurrent = peer.symbol === currentSymbol;
                        return (
                            <div
                                key={i}
                                className={`p-4 ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
                                    <div className={`min-w-0 font-black text-sm leading-tight ${isCurrent ? 'text-white' : 'text-indigo-950'}`}>
                                        {peer.name}
                                        {isCurrent && (
                                            <span className="ml-2 align-middle text-[9px] bg-white/20 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>
                                        )}
                                    </div>
                                    <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-indigo-100' : 'text-indigo-400'}`}>
                                        {peer.symbol}
                                    </span>
                                </div>
                                <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                                    {metricCols.map(c => (
                                        <div key={String(c.key)} className="min-w-0">
                                            <dt className={`text-[9px] font-black uppercase tracking-tight mb-0.5 ${isCurrent ? 'text-indigo-200' : 'text-indigo-400'}`}>
                                                {c.label}
                                            </dt>
                                            <dd className={`text-xs font-bold tabular-nums break-all ${isCurrent ? 'text-white' : 'text-indigo-950'}`}>
                                                {c.fmt ? c.fmt(peer[c.key]) : String(peer[c.key])}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        );
                    })}
                </div>

                <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-200 pb-2">
                    <table className="w-full text-sm min-w-max">
                        <thead>
                            <tr className="border-b border-indigo-50 bg-indigo-50/50">
                                {cols.map(c => (
                                    <th key={String(c.key)} className={`text-left px-4 md:px-5 py-3.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap ${c.key === 'name' ? 'min-w-[140px] md:min-w-[160px]' : 'min-w-[80px] md:min-w-[100px]'}`}>{c.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {peers.map((peer, i) => {
                                const isCurrent = peer.symbol === currentSymbol;
                                return (
                                    <tr key={i} className={`border-b border-indigo-50/60 transition-colors ${isCurrent ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50/30'}`}>
                                        {cols.map(c => (
                                            <td key={String(c.key)} className={`px-5 py-3.5 text-sm whitespace-nowrap ${c.key === 'name' ? 'font-black' : 'font-bold'} ${isCurrent ? 'text-white' : 'text-indigo-950'}`}>
                                                {c.fmt ? c.fmt(peer[c.key]) : String(peer[c.key])}
                                                {isCurrent && c.key === 'name' && (
                                                    <span className="ml-2 text-[9px] bg-white/20 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PeerComparisonSection;
