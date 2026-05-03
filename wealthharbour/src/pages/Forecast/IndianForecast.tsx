import React, { useState, useEffect } from 'react';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { 
    FiGlobe, FiTrendingUp, FiActivity, FiUsers, FiTarget, 
    FiArrowUpRight, FiArrowDownRight, FiShield, FiCpu, FiExternalLink 
} from 'react-icons/fi';
import { ForecastService, GuideService } from '../../services/api';

interface IndicatorHistory {
    year: string;
    val: string;
}

interface Indicator {
    title: string;
    color: string;
    status: string;
    change: string;
    forecast: string;
    history: IndicatorHistory[];
    insight: string;
}

interface QuarterlyPulseData {
    period: string;
    desc: string;
    stat: string;
}

const IndianForecast: React.FC = () => {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [quarterlyPulse, setQuarterlyPulse] = useState<QuarterlyPulseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [indicatorsData, pulseData, guideData] = await Promise.all([
                    ForecastService.getIndicators(),
                    ForecastService.getQuarterlyPulse(),
                    GuideService.getGuide('forecast')
                ]);
                if (indicatorsData) setIndicators(indicatorsData);
                if (pulseData) setQuarterlyPulse(pulseData);
                if (guideData) setGuide(guideData);
            } catch (err) {
                console.error('Failed to load forecast data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const getColor = (c: string) => {
        const map: Record<string, string> = {
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            rose: 'bg-rose-50 text-rose-600 border-rose-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
        };
        return map[c] || map.indigo;
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="India Outlook"
                subtitle="A comprehensive analysis of the Indian economic engine and its trajectory."
                icon={<FiGlobe className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Architecting Economic Forecasts...</p>
                </div>
            ) : indicators.length > 0 ? (
                <div className="mt-12 space-y-12">
                    {/* Indicator Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 stagger-children">
                        {indicators.map((item, idx) => {
                            const iconMap: Record<string, React.ReactNode> = {
                                "Real GDP Growth": <FiTrendingUp size={24} />,
                                "Consumer Inflation": <FiActivity size={24} />,
                                "Labor Dynamics": <FiUsers size={24} />,
                                "PPP Valuation": <FiTarget size={24} />
                            };
                            return (
                                <div key={idx} className="group bg-white p-10 rounded-[3rem] shadow-sm border border-indigo-50 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-10">
                                            <div className={`p-5 rounded-[1.5rem] border-2 shadow-inner ${getColor(item.color)} group-hover:scale-110 transition-transform duration-500`}>
                                                {iconMap[item.title] || <FiActivity size={24} />}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${item.change === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {item.status}
                                                </p>
                                                <div className="flex items-center justify-end gap-1">
                                                    {item.change === 'up' ? <FiArrowUpRight className="text-emerald-500" /> : <FiArrowDownRight className="text-rose-500" />}
                                                    <span className="text-3xl font-black text-indigo-950 tracking-tighter leading-none">{item.forecast}</span>
                                                </div>
                                                <p className="text-[9px] font-black text-indigo-900/20 uppercase tracking-widest mt-1">Est. 2025</p>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-indigo-950 mb-8 tracking-tighter uppercase leading-tight">{item.title}</h3>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-indigo-50">
                                        <div className="flex items-center justify-between px-2">
                                            {item.history.map((h: IndicatorHistory) => (
                                                <div key={h.year} className="text-center">
                                                    <p className="text-[8px] font-black text-indigo-900/30 uppercase tracking-widest mb-1">{h.year}</p>
                                                    <p className="font-black text-indigo-950 text-sm">{h.val}</p>
                                                </div>
                                            ))}
                                            <div className="h-8 w-px bg-indigo-50"></div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Target</p>
                                                <p className={`font-black text-sm ${item.color === 'rose' ? 'text-rose-600' : 'text-emerald-600'}`}>{item.forecast}</p>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-50 group-hover:bg-indigo-50 transition-colors">
                                            <p className="text-[10px] font-medium leading-relaxed text-indigo-900/60 italic">
                                                "{item.insight}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Deep Analysis Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-indigo-950 p-12 md:p-20 rounded-[4rem] text-white overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center text-white border border-white/20">
                                            <FiShield size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black tracking-tighter leading-tight">Fiscal Consolidation</h2>
                                            <p className="text-indigo-300/60 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Budgetary Discipline Roadmap</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <p className="text-indigo-200/70 text-lg font-medium leading-relaxed">
                                                The government is aggressively pursuing a fiscal glide path, targeting a deficit reduction to <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-8">5.1% of GDP</span>. This resilience is anchored by record-high tax collections.
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300/60">
                                                    <span>Trajectory Accuracy</span>
                                                    <span>92% Projected</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full w-[92%] bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 flex flex-col justify-center gap-8">
                                            {[
                                                { id: 1, text: 'Record GST Inflows' },
                                                { id: 2, text: 'Direct Tax Compliance +18%' },
                                                { id: 3, text: 'Digital Infra Scaling' }
                                            ].map(point => (
                                                <div key={point.id} className="flex items-center gap-6 group">
                                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300 font-black text-sm group-hover:bg-white group-hover:text-indigo-950 transition-all border border-white/10">{point.id}</div>
                                                    <p className="font-black text-indigo-50/90 tracking-tight group-hover:translate-x-2 transition-transform">{point.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-10 bg-white rounded-[3rem] border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex items-center gap-8 group">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <FiCpu size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-indigo-950 text-xl tracking-tighter leading-tight">Digital Edge</h4>
                                        <p className="text-[10px] text-indigo-900/30 font-black uppercase tracking-widest mt-1">UPI Dominance</p>
                                    </div>
                                </div>
                                <div className="p-10 bg-white rounded-[3rem] border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex items-center gap-8 group">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <FiTrendingUp size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-indigo-950 text-xl tracking-tighter leading-tight">Capex Push</h4>
                                        <p className="text-[10px] text-indigo-900/30 font-black uppercase tracking-widest mt-1">Infrastructure Peak</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Quarterly Pulse */}
                        <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-indigo-50 flex flex-col hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500">
                            <div className="mb-12">
                                <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Quarterly Pulse</h3>
                                <p className="text-[10px] font-black text-indigo-900/20 uppercase tracking-[0.2em] mt-2">Short-term velocity metrics</p>
                            </div>
                            <div className="space-y-10 flex-1">
                                {quarterlyPulse.map((q: QuarterlyPulseData) => (
                                    <div key={q.period} className="flex items-center justify-between border-b border-indigo-50/50 pb-8 group cursor-default">
                                        <div>
                                            <p className="text-lg font-black text-indigo-950 group-hover:text-indigo-600 transition-colors uppercase italic tracking-tighter">{q.period}</p>
                                            <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.1em] mt-1">{q.desc}</p>
                                        </div>
                                        <div className="text-3xl font-black text-indigo-950 font-mono tracking-tighter">{q.stat}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-12 w-full py-6 bg-indigo-50 text-indigo-600 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-indigo-100">
                                Download Analytical Report <FiExternalLink />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200 mt-12">
                    <div className="text-6xl mb-6 opacity-10">📉</div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Horizon Obscured</h3>
                    <p className="text-indigo-900/40 font-medium mt-2">Data stream currently offline. Re-establishing link...</p>
                </div>
            )}
        </PageShell>
    );
};

export default IndianForecast;

