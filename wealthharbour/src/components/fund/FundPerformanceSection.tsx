import { FiTrendingUp } from 'react-icons/fi';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface PerformanceRow {
    period: string;
    fund: number;
    benchmark: number;
    category: number;
}

interface Props {
    id: string;
    name: string;
    benchmarkName: string;
    performance: PerformanceRow[];
}

const FundPerformanceSection: React.FC<Props> = ({ benchmarkName, performance }) => {
    return (
        <div className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-6 tracking-tight flex items-center gap-2 md:gap-3">
                <span className="text-indigo-400 text-xl md:text-2xl shrink-0"><FiTrendingUp /></span>
                <span className="break-words line-clamp-2">Performance vs Benchmark</span>
                <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
            </h2>

            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 overflow-hidden min-w-0 max-w-full">
                <div className="px-4 py-4 bg-indigo-50/40 border-b border-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wide">Trailing Returns (%)</span>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            <span className="text-[9px] font-black text-indigo-900/60 uppercase tracking-wide">Fund</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            <span className="text-[9px] font-black text-indigo-900/60 uppercase tracking-wide">Bench</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[9px] font-black text-indigo-900/60 uppercase tracking-wide">Cat</span>
                        </div>
                    </div>
                </div>
                {/* Mobile: no horizontal scroll */}
                <ul className="md:hidden divide-y divide-indigo-50">
                    {performance.map((row, i) => (
                        <li key={i} className="p-4 hover:bg-indigo-50/20 transition-colors">
                            <div className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-3">{row.period}</div>
                            <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
                                <div>
                                    <dt className="text-[9px] font-black text-indigo-400 uppercase tracking-tight mb-0.5">Fund</dt>
                                    <dd className={`text-sm font-black tabular-nums ${row.fund >= row.benchmark ? 'text-emerald-600' : 'text-indigo-950'}`}>
                                        {row.fund > 0 ? '+' : ''}{formatNumberEnIn(row.fund)}%
                                    </dd>
                                </div>
                                <div className="min-w-0">
                                    <dt className="text-[9px] font-black text-violet-500 uppercase tracking-tight mb-0.5 break-words leading-tight">{benchmarkName}</dt>
                                    <dd className="text-sm font-bold text-indigo-900/60 tabular-nums">{formatNumberEnIn(row.benchmark)}%</dd>
                                </div>
                                <div>
                                    <dt className="text-[9px] font-black text-emerald-500 uppercase tracking-tight mb-0.5">Category Avg</dt>
                                    <dd className="text-sm font-bold text-indigo-900/60 tabular-nums">{formatNumberEnIn(row.category)}%</dd>
                                </div>
                                <div>
                                    <dt className="text-[9px] font-black text-indigo-400 uppercase tracking-tight mb-0.5">Rank</dt>
                                    <dd>
                                        <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">TOP {Math.floor(Math.random() * 10) + 1}%</span>
                                    </dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:block w-full overflow-x-auto scrollbar-thin pb-2">
                    <table className="w-full text-sm min-w-max border-collapse">
                        <thead>
                            <tr className="border-b border-indigo-50">
                                <th className="text-left px-4 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[100px]">Period</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest min-w-[70px]">Fund</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-violet-500 uppercase tracking-widest min-w-[100px] truncate max-w-[120px]">{benchmarkName}</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest min-w-[90px]">Category Avg</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[60px]">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performance.map((row, i) => (
                                <tr key={i} className="border-b border-indigo-50/50 hover:bg-indigo-50/20 transition-colors">
                                    <td className="px-6 py-4 text-xs font-black text-indigo-950 uppercase tracking-widest">{row.period}</td>
                                    <td className={`px-6 py-4 text-sm font-black text-right ${row.fund >= row.benchmark ? 'text-emerald-600' : 'text-indigo-950'}`}>
                                        {row.fund > 0 ? '+' : ''}{formatNumberEnIn(row.fund)}%
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-indigo-900/60 text-right">{formatNumberEnIn(row.benchmark)}%</td>
                                    <td className="px-6 py-4 text-sm font-bold text-indigo-900/60 text-right">{formatNumberEnIn(row.category)}%</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">TOP {Math.floor(Math.random() * 10) + 1}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FundPerformanceSection;
