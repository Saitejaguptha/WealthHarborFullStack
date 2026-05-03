import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBriefcase, FiMapPin } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';


const REITDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [reit, setReit] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        import('../../services/api').then(({ REITService }) => {
            if (id) {
                REITService.getREITDetails(decodeURIComponent(id)).then((data: any) => {
                    setReit(data || null);
                    setIsLoading(false);
                });
            }
        });
    }, [id]);

    if (isLoading) {
        return (
            <PageShell className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
            </PageShell>
        );
    }

    if (!reit) {
        return (
            <PageShell className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">REIT Not Found</h2>
                <button onClick={() => navigate('/reits')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                    Back to REITs
                </button>
            </PageShell>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/reits')} className="p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black rounded uppercase tracking-widest shrink-0">
                                {reit.type}
                            </span>
                            <span className="text-indigo-900/40 text-[9px] md:text-sm font-bold uppercase tracking-widest truncate">{reit.sponsor}</span>
                        </div>
                        <h1 className="text-lg md:text-3xl font-black text-indigo-950 tracking-tight leading-tight">{reit.name}</h1>
                    </div>
                </div>
                <div>
                     <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100/50 uppercase tracking-widest text-xs">
                        Invest Now
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                 <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl">
                     <p className="text-indigo-200/60 font-bold uppercase tracking-widest text-[10px] mb-2">Annual Dividend Yield</p>
                     <span className="text-4xl md:text-5xl font-black text-emerald-400 block mb-6">{reit.yield}</span>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                         <div>
                             <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">Total Leasable Area</p>
                             <p className="font-black text-white text-lg">{reit.area}</p>
                         </div>
                         <div>
                             <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">Committed Occupancy</p>
                             <p className="font-black text-white text-lg">{reit.occupancy}</p>
                         </div>
                         <div>
                             <p className="text-indigo-200/40 text-[9px] font-black uppercase tracking-widest mb-1">WALT</p>
                             <p className="font-black text-white text-lg">{reit.walt}</p>
                         </div>
                     </div>
                 </div>
                 
                 <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <h3 className="text-xl font-black text-indigo-950 mb-3 flex items-center gap-2"><FiBriefcase className="text-indigo-500" /> Portfolio Description</h3>
                            <p className="text-indigo-900/60 leading-relaxed font-medium text-sm">{reit.description}</p>
                        </div>
                        <div className="flex-1 lg:border-l lg:border-indigo-50 lg:pl-12">
                            <h3 className="text-lg font-black text-indigo-950 mb-4 flex items-center gap-2"><FiMapPin className="text-rose-500" /> Asset Location Split</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {(reit.locationSplit || []).map((loc: {city: string; pct: string}, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-indigo-50/30 p-3 rounded-xl border border-white">
                                        <span className="text-xs font-bold text-indigo-900/60">{loc.city}</span>
                                        <span className="font-black text-indigo-950 text-xs">{loc.pct}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

        </PageShell>
    );
};

export default REITDetails;
