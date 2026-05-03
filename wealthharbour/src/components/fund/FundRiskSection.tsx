import React from 'react';
import { FiShield, FiAlertTriangle, FiActivity, FiZap, FiTrendingUp } from 'react-icons/fi';
import MetricInfo from '../common/MetricInfo';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface Props {
    standardDeviation: number;
    sharpeRatio: number;
    sortinoRatio: number;
    alpha: number;
    beta: number;
}

const RiskCard = ({ icon, label, value, sub, color, metricKey }: { icon: React.ReactNode, label: string, value: React.ReactNode, sub: string, color: string, metricKey: string }) => (
    <div className="bg-white rounded-[2rem] border border-indigo-50 shadow-lg shadow-indigo-50 p-4 md:p-6 relative overflow-hidden group">
        <MetricInfo metricKey={metricKey} />
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${color} flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg transition-transform group-hover:scale-110`}>
            {icon}
        </div>
        <p className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl md:text-2xl font-black text-indigo-950">{value}</p>
        <p className="text-[10px] md:text-[11px] font-medium text-indigo-900/40 mt-1 leading-tight">{sub}</p>
    </div>
);

const FundRiskSection: React.FC<Props> = ({ standardDeviation, sharpeRatio, sortinoRatio, alpha, beta }) => {
    return (
        <div className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-6 tracking-tight flex items-center gap-2 md:gap-3">
                <span className="text-indigo-400 text-xl md:text-2xl shrink-0"><FiShield /></span>
                <span className="break-words line-clamp-2">Risk & Volatility Analysis</span>
                <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-0">
                <RiskCard 
                    icon={<FiActivity />} 
                    label="Std. Deviation" 
                    value={formatNumberEnIn(standardDeviation)} 
                    sub="Measure of volatility" 
                    color="bg-indigo-600" 
                    metricKey="Standard Deviation"
                />
                <RiskCard 
                    icon={<FiZap />} 
                    label="Sharpe Ratio" 
                    value={formatNumberEnIn(sharpeRatio)} 
                    sub="Risk-adjusted return" 
                    color="bg-violet-500" 
                    metricKey="Sharpe Ratio"
                />
                <RiskCard 
                    icon={<FiTrendingUp />} 
                    label="Alpha" 
                    value={alpha > 0 ? `+${formatNumberEnIn(alpha)}` : formatNumberEnIn(alpha)} 
                    sub="Excess vs Benchmark" 
                    color="bg-emerald-500" 
                    metricKey="Alpha"
                />
                <RiskCard 
                    icon={<FiShield />} 
                    label="Beta" 
                    value={formatNumberEnIn(beta)} 
                    sub="Market sensitivity" 
                    color="bg-cyan-500" 
                    metricKey="Beta"
                />
                <RiskCard 
                    icon={<FiAlertTriangle />} 
                    label="Sortino" 
                    value={formatNumberEnIn(sortinoRatio)} 
                    sub="Downside risk protection" 
                    color="bg-amber-500" 
                    metricKey="Sortino Ratio"
                />
            </div>
        </div>
    );
};

export default FundRiskSection;
