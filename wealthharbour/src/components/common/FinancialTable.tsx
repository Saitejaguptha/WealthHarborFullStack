import { formatNumberEnIn } from '../../utils/numberFormat';
import MetricInfo from './MetricInfo';

export interface TableRowDef<T> {
    key: keyof T;
    label: string;
    prefix?: string;
    suffix?: string;
    highlight?: boolean;
    format?: (val: any) => string;
    cellClassName?: (val: any) => string;
}

interface FinancialTableProps<T> {
    data: T[];
    columns: { label: string; key: keyof T }[];
    rows: TableRowDef<T>[];
    metricColumnLabel?: string;
    metricColumnWidth?: string;
    columnWidth?: string;
    className?: string;
    headerClassName?: string;
}

const FinancialTable = <T extends Record<string, any>>({
    data,
    columns,
    rows,
    metricColumnLabel = 'Metric',
    metricColumnWidth = 'md:min-w-[160px]',
    columnWidth = 'md:min-w-[110px]',
    className = "",
    headerClassName = "bg-indigo-50/40",
}: FinancialTableProps<T>) => {
    const fmtNum = (val: any) => {
        if (typeof val !== 'number') return String(val);
        return formatNumberEnIn(val);
    };

    return (
        <>
            {/* ── Desktop: Traditional Table ── */}
            <div className={`w-full overflow-x-auto custom-scrollbar pb-2 hidden md:block ${className}`}>
                <table className="w-full border-separate border-spacing-0 min-w-max text-sm">

                    <thead>
                        <tr className={`border-b border-indigo-50 ${headerClassName}`}>
                            <th className={`text-left px-5 py-3 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest ${metricColumnWidth}`}>
                                {metricColumnLabel}
                            </th>
                            {columns.map((col, ci) => (
                                <th key={ci} className={`text-right px-4 py-3 text-[9px] md:text-[10px] font-black text-indigo-600 uppercase md:tracking-widest whitespace-nowrap ${columnWidth}`}>
                                    {String(col.label)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri} className={`border-b border-indigo-50/50 ${row.highlight ? 'bg-indigo-50/40' : 'hover:bg-indigo-50/20'} transition-colors`}>
                                <td className={`px-5 py-3 text-[10px] md:text-xs font-bold ${row.highlight ? 'text-indigo-700' : 'text-indigo-900/70'} whitespace-nowrap`}>
                                    <div className="flex items-center gap-2">
                                        {row.label}
                                        <MetricInfo metricKey={row.label} position="inline-beside" />
                                    </div>
                                </td>
                                {data.map((d, di) => {
                                    const val = d[row.key];
                                    const displayVal = row.format ? row.format(val) : `${row.prefix || ''}${fmtNum(val)}${row.suffix || ''}`;
                                    return (
                                        <td key={di} className={`text-right px-4 py-3 font-bold text-[11px] md:text-sm tabular-nums ${row.highlight ? 'text-indigo-700' : (row.cellClassName ? row.cellClassName(val) : 'text-indigo-950')} whitespace-nowrap`}>
                                            {displayVal}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile: Stacked Card Layout ── */}
            <div className={`md:hidden space-y-3 p-3 ${className}`}>
                {data.map((d, di) => (
                    <div key={di} className="bg-indigo-50/30 rounded-2xl border border-indigo-100/50 overflow-hidden">
                        {/* Column Header (e.g. Quarter or Year) */}
                        <div className="px-4 py-2.5 bg-indigo-600 text-white">
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {String(columns[di]?.label || `#${di + 1}`)}
                            </span>
                        </div>
                        {/* Metric rows */}
                        <div className="divide-y divide-indigo-100/50">
                            {rows.map((row, ri) => {
                                const val = d[row.key];
                                const displayVal = row.format ? row.format(val) : `${row.prefix || ''}${fmtNum(val)}${row.suffix || ''}`;
                                return (
                                    <div key={ri} className={`flex justify-between items-center px-4 py-2.5 ${row.highlight ? 'bg-indigo-50/60' : ''}`}>
                                        <span className={`text-[11px] font-bold ${row.highlight ? 'text-indigo-700' : 'text-indigo-900/60'}`}>
                                            {row.label}
                                        </span>
                                        <span className={`text-[12px] font-black tabular-nums ${row.highlight ? 'text-indigo-700' : (row.cellClassName ? row.cellClassName(val) : 'text-indigo-950')}`}>
                                            {displayVal}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FinancialTable;
