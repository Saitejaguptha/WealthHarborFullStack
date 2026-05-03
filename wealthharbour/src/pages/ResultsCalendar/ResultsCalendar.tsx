import React, { useState, useEffect } from 'react';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { FiCalendar, FiBell, FiAlertCircle } from 'react-icons/fi';
import { CalendarService, GuideService } from '../../services/api';

interface CalendarEvent {
    date: string;
    company: string;
    event: string;
    impact: string;
}

const ResultsCalendar: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [eventsData, guideData] = await Promise.all([
                    CalendarService.getEvents(),
                    GuideService.getGuide('calendar')
                ]);
                if (eventsData) setEvents(eventsData);
                if (guideData) setGuide(guideData);
            } catch (err) {
                console.error('Failed to load calendar events:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Results Calendar"
                subtitle="Track corporate earnings, board meetings, and market-moving events."
                icon={<FiCalendar className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Synchronizing Event Chronology...</p>
                </div>
            ) : events.length > 0 ? (
                <div className="mt-12 space-y-6 stagger-children">
                    {events.map((event, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white border border-indigo-50 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="text-center bg-indigo-50 px-6 py-4 rounded-[1.5rem] min-w-[120px] group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                    <div className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Scheduled</div>
                                    <div className="text-sm font-black tracking-tight">{event.date}</div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-indigo-950 tracking-tighter group-hover:text-indigo-600 transition-colors">{event.company}</h3>
                                    <p className="text-[10px] text-indigo-900/30 font-black uppercase tracking-[0.2em] mt-1">{event.event}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-indigo-50 pt-6 md:pt-0">
                                <div className="flex items-center gap-3">
                                    <FiAlertCircle className={event.impact === 'High' ? 'text-rose-500' : event.impact === 'Medium' ? 'text-amber-500' : 'text-indigo-300'} />
                                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                        event.impact === 'High' ? 'bg-rose-500 text-white' : 
                                        event.impact === 'Medium' ? 'bg-amber-500 text-white' : 
                                        'bg-indigo-100 text-indigo-600'
                                    }`}>
                                        Impact: {event.impact}
                                    </span>
                                </div>
                                <button className="p-4 bg-indigo-50 text-indigo-600 rounded-[1rem] hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-200">
                                    <FiBell size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200 mt-12">
                    <div className="text-6xl mb-6 opacity-10">📅</div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Chronology Clear</h3>
                    <p className="text-indigo-900/40 font-medium mt-2">No major corporate events detected in the immediate window</p>
                </div>
            )}
        </PageShell>
    );
};

export default ResultsCalendar;

