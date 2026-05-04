import React, { useState } from 'react';
import {
    FiCalendar, FiFileText, FiLayers, FiDollarSign, FiUsers,
    FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import SectionTitle from '../../components/common/SectionTitle';
import FinancialTable, { type TableRowDef } from '../../components/common/FinancialTable';
import { formatNumberEnIn, formatIntegerEnIn } from '../../utils/numberFormat';
import type { Stock } from '../../types/stock';

// ─── Quarterly Results ──────────────────────────────────────────
export const QuarterlyResultsSection: React.FC<{ stock: Stock }> = ({ stock }) => {
    const [page, setPage] = useState(0);
    if (!stock || !stock.quarterlyResults) return null;
    const perPage = 4;
    const quarters = stock.quarterlyResults;
    const totalPages = Math.ceil(quarters.length / perPage);
    const visible = quarters.slice(page * perPage, page * perPage + perPage);

    const rows: TableRowDef<typeof visible[0]>[] = [
        { key: 'sales', label: 'Sales', prefix: '₹', suffix: ' Cr' },
        { key: 'expenses', label: 'Expenses', prefix: '₹', suffix: ' Cr' },
        { key: 'operatingProfit', label: 'Operating Profit', prefix: '₹', suffix: ' Cr', highlight: true },
        { key: 'opm', label: 'OPM %', suffix: '%' },
        { key: 'otherIncome', label: 'Other Income', prefix: '₹', suffix: ' Cr' },
        { key: 'profitBeforeTax', label: 'Profit Before Tax', prefix: '₹', suffix: ' Cr' },
        { key: 'taxPercent', label: 'Tax %', suffix: '%' },
        { key: 'netProfit', label: 'Net Profit', prefix: '₹', suffix: ' Cr', highlight: true },
        { key: 'eps', label: 'EPS (₹)', prefix: '₹' },
    ];

    return (
        <div className="mb-6 md:mb-12">
            <SectionTitle icon={<FiCalendar />} title="Quarterly Results" />
            <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                <div className="flex items-center justify-between p-3 md:p-4 border-b border-indigo-50 bg-indigo-50/40 gap-3">
                    <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        {page * perPage + 1}–{Math.min((page + 1) * perPage, quarters.length)} of {quarters.length} Quarters
                    </span>
                    <div className="flex gap-1.5">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 md:p-2 rounded-xl bg-white border border-indigo-100 text-indigo-600 disabled:opacity-30 hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
                        ><FiChevronLeft className="text-base" /></button>
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 md:p-2 rounded-xl bg-white border border-indigo-100 text-indigo-600 disabled:opacity-30 hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
                        ><FiChevronRight className="text-base" /></button>
                    </div>
                </div>
                <FinancialTable
                    data={visible}
                    columns={visible.map(q => ({ label: q.quarter, key: 'quarter' as keyof typeof visible[0] }))}
                    rows={rows}
                    metricColumnLabel="Metric"
                />
            </div>
        </div>
    );
};

// ─── Profit & Loss ───────────────────────────────────────────────
export const ProfitLossSection: React.FC<{ stock: Stock }> = ({ stock }) => {
    if (!stock || !stock.profitLoss) return null;
    const data = stock.profitLoss;

    const rows: TableRowDef<typeof data[0]>[] = [
        { key: 'sales', label: 'Sales', prefix: '₹', suffix: ' Cr' },
        { key: 'expenses', label: 'Expenses', prefix: '₹', suffix: ' Cr' },
        { key: 'operatingProfit', label: 'Operating Profit', prefix: '₹', suffix: ' Cr', highlight: true },
        { key: 'opm', label: 'OPM %', suffix: '%' },
        { key: 'otherIncome', label: 'Other Income', prefix: '₹', suffix: ' Cr' },
        { key: 'depreciation', label: 'Depreciation', prefix: '₹', suffix: ' Cr' },
        { key: 'interest', label: 'Interest', prefix: '₹', suffix: ' Cr' },
        { key: 'profitBeforeTax', label: 'Profit Before Tax', prefix: '₹', suffix: ' Cr' },
        { key: 'tax', label: 'Tax', prefix: '₹', suffix: ' Cr' },
        { key: 'netProfit', label: 'Net Profit', prefix: '₹', suffix: ' Cr', highlight: true },
        { key: 'eps', label: 'EPS (₹)', prefix: '₹' },
        { key: 'dividendPayout', label: 'Dividend Payout %', suffix: '%' },
    ];

    return (
        <div className="mb-6 md:mb-12">
            <SectionTitle icon={<FiFileText />} title="Profit & Loss" />
            <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                <FinancialTable
                    data={data}
                    columns={data.map(d => ({ label: d.year, key: 'year' as keyof typeof data[0] }))}
                    rows={rows}
                    metricColumnLabel="Metric (₹ Cr)"
                />
            </div>
        </div>
    );
};

// ─── Balance Sheet ──────────────────────────────────────────────
export const BalanceSheetSection: React.FC<{ stock: Stock }> = ({ stock }) => {
    if (!stock || !stock.balanceSheet) return null;
    const data = stock.balanceSheet;

    const liabilityRows: TableRowDef<typeof data[0]>[] = [
        { key: 'equityCapital', label: 'Share Capital', prefix: '₹' },
        { key: 'reserves', label: 'Reserves', prefix: '₹' },
        { key: 'borrowings', label: 'Borrowings', prefix: '₹' },
        { key: 'otherLiabilities', label: 'Other Liabilities', prefix: '₹' },
        { key: 'totalLiabilities', label: 'Total Liabilities', prefix: '₹', highlight: true },
    ];
    const assetRows: TableRowDef<typeof data[0]>[] = [
        { key: 'fixedAssets', label: 'Fixed Assets', prefix: '₹' },
        { key: 'cwip', label: 'CWIP', prefix: '₹' },
        { key: 'investments', label: 'Investments', prefix: '₹' },
        { key: 'otherAssets', label: 'Other Assets', prefix: '₹' },
        { key: 'totalAssets', label: 'Total Assets', prefix: '₹', highlight: true },
    ];

    return (
        <div className="mb-6 md:mb-12">
            <SectionTitle icon={<FiLayers />} title="Balance Sheet" />
            <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                <div className="px-5 py-3 border-b border-indigo-100 bg-indigo-50/30">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">All figures in ₹ Cr</span>
                </div>
                <div className="flex flex-col">
                    <FinancialTable
                        data={data}
                        columns={data.map(d => ({ label: d.year, key: 'year' as keyof typeof data[0] }))}
                        rows={liabilityRows}
                        metricColumnLabel="Liabilities"
                        headerClassName="bg-indigo-50/20"
                    />
                    <FinancialTable
                        data={data}
                        columns={data.map(d => ({ label: d.year, key: 'year' as keyof typeof data[0] }))}
                        rows={assetRows}
                        metricColumnLabel="Assets"
                        headerClassName="bg-indigo-50/20"
                    />
                </div>
            </div>
        </div>
    );
};

// ─── Cash Flow ──────────────────────────────────────────────────
export const CashFlowSection: React.FC<{ stock: Stock }> = ({ stock }) => {
    if (!stock || !stock.cashFlow) return null;
    const data = stock.cashFlow;

    const rows: TableRowDef<typeof data[0]>[] = [
        {
            key: 'operatingActivity',
            label: 'Cash from Operating Activity',
            cellClassName: (val: unknown) => typeof val === 'number' ? (val >= 0 ? 'text-emerald-600' : 'text-rose-600') : '',
            format: (val: unknown) => typeof val === 'number' ? `${val >= 0 ? '+' : ''}₹${formatNumberEnIn(val)}` : String(val ?? '')
        },
        {
            key: 'investingActivity',
            label: 'Cash from Investing Activity',
            cellClassName: (val: unknown) => typeof val === 'number' ? (val >= 0 ? 'text-emerald-600' : 'text-rose-600') : '',
            format: (val: unknown) => typeof val === 'number' ? `${val >= 0 ? '+' : ''}₹${formatNumberEnIn(val)}` : String(val ?? '')
        },
        {
            key: 'financingActivity',
            label: 'Cash from Financing Activity',
            cellClassName: (val: unknown) => typeof val === 'number' ? (val >= 0 ? 'text-emerald-600' : 'text-rose-600') : '',
            format: (val: unknown) => typeof val === 'number' ? `${val >= 0 ? '+' : ''}₹${formatNumberEnIn(val)}` : String(val ?? '')
        },
        {
            key: 'netCashFlow',
            label: 'Net Cash Flow',
            highlight: true,
            cellClassName: (val: unknown) => typeof val === 'number' ? (val >= 0 ? 'text-emerald-600' : 'text-rose-600') : '',
            format: (val: unknown) => typeof val === 'number' ? `${val >= 0 ? '+' : ''}₹${formatNumberEnIn(val)}` : String(val ?? '')
        },
    ];

    return (
        <div className="mb-6 md:mb-12">
            <SectionTitle icon={<FiDollarSign />} title="Cash Flows" />
            <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                <FinancialTable
                    data={data}
                    columns={data.map(d => ({ label: d.year, key: 'year' as keyof typeof data[0] }))}
                    rows={rows}
                    metricColumnLabel="Activity (₹ Cr)"
                    metricColumnWidth="md:min-w-[220px]"
                />
            </div>
        </div>
    );
};

// ─── Shareholding Pattern ──────────────────────────────────────
export const ShareholdingSection: React.FC<{ stock: Stock }> = ({ stock }) => {
    if (!stock || !stock.shareholding) return null;
    const data = stock.shareholding;
    const latest = data[data.length - 1] || {};

    const holders = [
        { key: 'promoters' as const, label: 'Promoters', color: '#6366F1', bg: 'bg-indigo-600' },
        { key: 'fii' as const, label: 'FII', color: '#8B5CF6', bg: 'bg-violet-500' },
        { key: 'dii' as const, label: 'DII', color: '#06B6D4', bg: 'bg-cyan-500' },
        { key: 'government' as const, label: 'Government', color: '#10B981', bg: 'bg-emerald-500' },
        { key: 'public' as const, label: 'Public', color: '#F59E0B', bg: 'bg-amber-500' },
        { key: 'others' as const, label: 'Others', color: '#6B7280', bg: 'bg-gray-400' },
    ];

    return (
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiUsers />} title="Shareholding Pattern" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-6">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-5">{latest?.quarter} — Latest Holdings</p>
                    <div className="flex rounded-full overflow-hidden h-4 mb-6 gap-0.5">
                        {holders.map(h => (
                            <div key={h.key} title={`${h.label}: ${latest?.[h.key]}%`}
                                style={{ width: `${latest?.[h.key] ?? 0}%`, backgroundColor: h.color }}
                                className="transition-all duration-500" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {holders.map(h => (
                            <div key={h.key} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50">
                                <div className={`w-3 h-3 rounded-full ${h.bg} shrink-0`} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{h.label}</p>
                                    <p className="text-base font-black text-indigo-950">{formatNumberEnIn(latest?.[h.key] as number)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">No. of Shareholders</span>
                        <span className="text-sm font-black text-indigo-950">{formatIntegerEnIn(latest?.noOfShareholders || 0)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50/50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-indigo-50 bg-indigo-50/30">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Historical Trend (%)</p>
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:block w-full overflow-x-auto custom-scrollbar pb-2">
                        <table className="w-full text-sm min-w-max border-collapse">
                            <thead>
                                <tr className="border-b border-indigo-50 bg-indigo-50/20">
                                    <th className="text-left px-4 py-2.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest min-w-[100px]">Holder</th>
                                    {data.map(d => (
                                        <th key={d.quarter} className="text-right px-3 py-2.5 text-[9px] font-black text-indigo-500 uppercase tracking-widest whitespace-nowrap min-w-[80px]">{d.quarter}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {holders.map(h => (
                                    <tr key={h.key} className="border-b border-indigo-50/50 hover:bg-indigo-50/20 transition-colors">
                                        <td className="px-4 py-2.5 text-xs font-bold text-indigo-900/70 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${h.bg} shrink-0`} />
                                            {h.label}
                                        </td>
                                        {data.map(d => (
                                            <td key={d.quarter} className="text-right px-3 py-2.5 text-xs font-bold text-indigo-950">{formatNumberEnIn(d[h.key] as number)}%</td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="border-b border-indigo-50/50 bg-indigo-50/20">
                                    <td className="px-4 py-2.5 text-xs font-black text-indigo-700">Shareholders</td>
                                    {data.map(d => (
                                        <td key={d.quarter} className="text-right px-3 py-2.5 text-xs font-bold text-indigo-700 whitespace-nowrap">{formatIntegerEnIn(d.noOfShareholders)}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile: Stacked by quarter */}
                    <div className="md:hidden space-y-2 p-3">
                        {data.map(d => (
                            <div key={d.quarter} className="bg-indigo-50/30 rounded-xl border border-indigo-100/50 overflow-hidden">
                                <div className="px-4 py-2 bg-indigo-600 text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{d.quarter}</span>
                                </div>
                                <div className="divide-y divide-indigo-100/50">
                                    {holders.map(h => (
                                        <div key={h.key} className="flex justify-between items-center px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${h.bg} shrink-0`} />
                                                <span className="text-[11px] font-bold text-indigo-900/60">{h.label}</span>
                                            </div>
                                            <span className="text-[12px] font-black text-indigo-950 tabular-nums">{formatNumberEnIn(d[h.key] as number)}%</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center px-4 py-2 bg-indigo-50/40">
                                        <span className="text-[11px] font-black text-indigo-700">Shareholders</span>
                                        <span className="text-[12px] font-black text-indigo-700 tabular-nums">{formatIntegerEnIn(d.noOfShareholders)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
