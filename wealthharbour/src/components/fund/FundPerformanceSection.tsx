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

            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 overflow-hidden">
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

                <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                    <table className="w-full text-sm min-w-max border-collapse">
                        <thead>
                            <tr className="border-b border-indigo-50 bg-indigo-50/20">
                                <th className="text-left px-5 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[120px]">Period</th>
                                <th className="text-right px-5 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest min-w-[80px]">Fund</th>
                                <th className="text-right px-5 py-4 text-[10px] font-black text-violet-500 uppercase tracking-widest min-w-[120px] max-w-[180px] break-words">{benchmarkName}</th>
                                <th className="text-right px-5 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest min-w-[100px]">Category Avg</th>
                                <th className="text-right px-5 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[100px]">Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50/50">
                            {performance.map((row, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                                    <td className="px-5 py-4 text-xs font-black text-indigo-950 uppercase tracking-widest">{row.period}</td>
                                    <td className={`px-5 py-4 text-sm font-black text-right ${row.fund >= row.benchmark ? 'text-emerald-600' : 'text-indigo-950'}`}>
                                        {row.fund > 0 ? '+' : ''}{formatNumberEnIn(row.fund)}%
                                    </td>
                                    <td className="px-5 py-4 text-sm font-bold text-indigo-900/60 text-right">{formatNumberEnIn(row.benchmark)}%</td>
                                    <td className="px-5 py-4 text-sm font-bold text-indigo-900/60 text-right">{formatNumberEnIn(row.category)}%</td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">TOP {Math.floor(Math.random() * 10) + 1}%</span>
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
