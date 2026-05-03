import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLayers, FiSearch } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { IPOService } from '../../services/api';

interface IPOData {
    id: string;
    name: string;
    status: string;
    priceRange: string;
    date: string;
    gmp?: string;
    gmpPercentage?: string;
    listingExpected?: string;
    listingPrice?: string;
    listingGain?: string;
}

const IPO: React.FC = () => {
    const navigate = useNavigate();
    
    const [activeIpos, setActiveIpos] = useState<IPOData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Upcoming' | 'Listed'>('All');
    const [guide, setGuide] = useState<any>(null);

    const loadGuide = async () => {
        const { GuideService } = await import('../../services/api');
        const data = await GuideService.getGuide('ipo');
        if (data) setGuide(data);
    };

    const fetchIPOs = async () => {
        setIsLoading(true);
        try {
            const data = await IPOService.getAllIPOs(filterStatus, searchTerm);
            if (data) setActiveIpos(data);
        } catch (err) {
            console.error('Failed to fetch IPOs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGuide();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchIPOs();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [filterStatus, searchTerm]);

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="IPO Dashboard"
                subtitle="Track grey market premium and listing gains"
                icon={<FiLayers className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
                <div className="flex-1 flex gap-4">
                    <div className="flex-1 relative group">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by company name..." 
                            className="w-full pl-16 pr-8 py-5 bg-white border border-indigo-50 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchIPOs}
                        className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                    >
                        Search
                    </button>
                </div>
                <div className="flex p-1.5 bg-indigo-50 rounded-[2rem] gap-1">
                    {['All', 'Open', 'Upcoming', 'Listed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                filterStatus === status 
                                ? 'bg-white text-indigo-600 shadow-md scale-100' 
                                : 'text-indigo-400 hover:text-indigo-600'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Tracking Upcoming Listings...</p>
                    </div>
                ) : activeIpos.length > 0 ? activeIpos.map((ipo) => (
                    <div 
                        key={ipo.id} 
                        className="card-luxury p-8 flex flex-col justify-between h-full group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                    >
                        {ipo.status === 'Listed' && (
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter shadow-lg">
                                    LISTED
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="flex justify-between items-start mb-6 pr-12">
                                <h3 className="text-2xl font-black text-indigo-950 leading-tight group-hover:text-indigo-600 transition-colors">{ipo.name}</h3>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    ipo.status === 'Open' ? 'bg-emerald-500 text-white' : 
                                    ipo.status === 'Upcoming' ? 'bg-indigo-600 text-white' : 
                                    'bg-slate-500 text-white'
                                }`}>
                                    {ipo.status}
                                </span>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between py-3 border-b border-indigo-50/50">
                                    <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Price Band</span>
                                    <span className="font-black text-indigo-950">{ipo.priceRange}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-indigo-50/50">
                                    <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Open Date</span>
                                    <span className="font-black text-indigo-950">{ipo.date}</span>
                                </div>
                                
                                {ipo.status === 'Listed' ? (
                                    <div className="flex justify-between py-3 border-b border-indigo-50/50 bg-emerald-50/30 -mx-4 px-4 rounded-xl">
                                        <span className="text-emerald-900/60 font-black uppercase tracking-widest text-[10px]">Listing Gain</span>
                                        <span className="font-black text-emerald-600">{ipo.listingGain}</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between py-3 border-b border-indigo-50/50 bg-indigo-50/30 -mx-4 px-4 rounded-xl">
                                            <div className="flex flex-col">
                                                <span className="text-indigo-900/60 font-black uppercase tracking-widest text-[10px]">Grey Market (GMP)</span>
                                                <span className="text-[10px] text-indigo-400 font-bold">Expectation: {ipo.gmpPercentage}</span>
                                            </div>
                                            <span className="font-black text-emerald-600 text-lg">{ipo.gmp || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-3">
                                            <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Expected Listing</span>
                                            <span className="font-black text-indigo-950">{ipo.listingExpected}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(`/ipo/${encodeURIComponent(ipo.name)}`)}
                            className="w-full mt-auto py-4 bg-indigo-50 text-indigo-600 font-black rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 uppercase tracking-widest text-xs shadow-sm"
                        >
                            Know More
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">🚀</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No IPOs found</h3>
                        <p className="text-indigo-900/30 font-medium">Try adjusting your filters or search</p>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default IPO;

