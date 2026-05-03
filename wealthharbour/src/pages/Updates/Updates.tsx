import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiGlobe, FiAlertCircle, FiTrendingUp, FiChevronRight, FiZap } from 'react-icons/fi';
import { CalendarService } from '../../services/api';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';

interface CatalystEvent {
    type: string;
    date: string;
    category: string;
    impact: string;
    title: string;
    time: string;
    location: string;
    description: string;
}

const Updates: React.FC = () => {
    const [events, setEvents] = useState<CatalystEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const data = await CalendarService.getEvents();
            const catalysts = data.filter((e: CatalystEvent) => e.type === 'catalyst');
            setEvents(catalysts);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const getIcon = (category: string) => {
        switch (category) {
            case 'Policy': return <FiTrendingUp className="text-indigo-600" />;
            case 'Elections': return <FiAlertCircle className="text-rose-600" />;
            case 'FED': return <FiGlobe className="text-blue-600" />;
            case 'ECB': return <FiCalendar className="text-purple-600" />;
            default: return <FiCalendar className="text-indigo-600" />;
        }
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Market Catalysts"
                subtitle="Tracking the global events that drive market momentum."
                icon={<FiZap className="text-amber-500" />}
            />

            <div className="relative mt-12 px-4 md:px-8">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-100 via-indigo-50 to-transparent transform md:-translate-x-1/2 hidden md:block"></div>

                <div className="space-y-12 relative">
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center py-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Scanning Global Catalysts...</p>
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event, idx) => (
                            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Date Section */}
                                <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center">
                                    <div className={`flex flex-col items-center md:items-start ${idx % 2 === 0 ? 'md:items-start' : 'md:items-end'} w-full`}>
                                        <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-100">
                                            {event.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Marker */}
                                <div className="hidden md:flex w-12 h-12 rounded-full bg-white border-4 border-indigo-50 shadow-xl items-center justify-center z-10 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-1/2">
                                    <div className="bg-white border border-indigo-50 p-8 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                                    {getIcon(event.category)}
                                                </div>
                                                <div>
                                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 ${
                                                        event.impact === 'Critical' ? 'bg-rose-50 text-rose-600' : 
                                                        event.impact === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {event.impact} Impact
                                                    </span>
                                                    <h3 className="text-xl font-black text-indigo-950 leading-tight">{event.title}</h3>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end text-[10px] font-black text-indigo-900/40 uppercase tracking-widest gap-2">
                                                <div className="flex items-center gap-2">
                                                    <FiClock className="text-indigo-400" /> {event.time}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiGlobe className="text-indigo-400" /> {event.location}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-indigo-900/60 font-medium leading-relaxed mb-8 italic">
                                            "{event.description}"
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-indigo-50">
                                            <div className="flex gap-4">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                                                    {event.category}
                                                </span>
                                                <span className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mt-1">Market Phase: {idx < 2 ? 'Pre-Opening' : 'Consolidation'}</span>
                                            </div>
                                            <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                                                Analyze Potential Impact <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200">
                            <div className="text-6xl mb-6 opacity-10">🌍</div>
                            <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Quiet Horizons</h3>
                            <p className="text-indigo-900/40 font-medium mt-2">No major catalysts detected in the current cycle</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-24 relative overflow-hidden bg-indigo-950 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Stay Ahead of the Pulse</h2>
                    <p className="text-indigo-200/60 text-lg font-medium mb-10 leading-relaxed">Get instant notifications on your device as soon as the results of these catalysts are announced.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="email" placeholder="Your trading email" className="flex-1 bg-white/10 border-none rounded-2xl px-6 py-4 text-white placeholder-indigo-300/50 focus:ring-4 focus:ring-indigo-500/30 outline-none backdrop-blur-md" />
                        <button className="bg-white text-indigo-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">Enable Alerts</button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default Updates;
