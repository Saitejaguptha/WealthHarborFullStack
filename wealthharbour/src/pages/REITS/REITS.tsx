import React, { useState, useEffect } from 'react';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { FiSearch, FiPieChart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { REITService, GuideService } from '../../services/api';

interface REITData {
    id: string;
    name: string;
    yield: string;
    type: string;
    area: string;
}

const REITS: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [reits, setReits] = useState<REITData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [reitData, guideData] = await Promise.all([
                    REITService.getAllREITs(),
                    GuideService.getGuide('reits')
                ]);
                if (reitData) setReits(reitData);
                if (guideData) setGuide(guideData);
            } catch (err) {
                console.error('Failed to load REIT data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredREITs = reits.filter(reit => 
        reit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="REIT Explorer"
                subtitle="Invest in large-scale real estate portfolios like commercial offices and tech parks"
                icon={<FiPieChart className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {/* Search */}
            <div className="mb-12 relative max-w-2xl group">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by REIT name (e.g. Embassy, Mindspace)..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border border-indigo-50 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-indigo-950 placeholder:text-indigo-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Surveying Real Estate Assets...</p>
                    </div>
                ) : filteredREITs.length > 0 ? (
                    filteredREITs.map((reit, idx) => (
                        <div 
                            key={reit.id || idx} 
                            className="card-luxury p-8 flex flex-col justify-between hover:-translate-y-2 transition-all duration-500 group"
                        >
                            <div>
                                <h3 className="text-2xl font-black text-indigo-950 leading-tight mb-6 group-hover:text-indigo-600 transition-colors">{reit.name}</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 border-b border-indigo-50/50">
                                        <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Dividend Yield</span>
                                        <span className="font-black text-emerald-600">{reit.yield}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-indigo-50/50">
                                        <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Portfolio Segment</span>
                                        <span className="font-black text-indigo-600">{reit.type}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-indigo-50/50">
                                        <span className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px]">Total Area Managed</span>
                                        <span className="font-black text-indigo-950">{reit.area}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(`/reits/${encodeURIComponent(reit.id || reit.name)}`)}
                                className="w-full mt-8 py-4 bg-indigo-50 text-indigo-600 font-black rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 uppercase tracking-widest text-xs shadow-sm"
                            >
                                Know More
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">🏢</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No REITs found</h3>
                        <p className="text-indigo-900/30 font-medium">Try another search term or asset class</p>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default REITS;

