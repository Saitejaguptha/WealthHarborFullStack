import React, { useState, useEffect } from 'react';
import { FiActivity, FiPieChart } from 'react-icons/fi';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { ETFService, GuideService } from '../../services/api';
import type { ETF } from '../../types/etf';

const ETFs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [etfs, setEtfs] = useState<ETF[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGuide = async () => {
        const data = await GuideService.getGuide('etfs');
        if (data) setGuide(data);
    };

    const loadFilters = async () => {
        try {
            const data = await ETFService.getFilters();
            if (data) {
                setCategories(data.categories || ['All']);
            }
        } catch (err) {
            console.error('Failed to load filters:', err);
        }
    };

    const loadETFs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ETFService.getETFs({
                category: selectedCategory
            });
            
            const filtered = data.filter((etf: ETF) => 
                etf.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                etf.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            setEtfs(filtered);
        } catch (err) {
            setError('Failed to load ETFs. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFilters();
        loadGuide();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadETFs();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory]);

    return (
        <PageShell className="animate-in fade-in duration-700">
            <PageHeader 
                title="ETF Hub"
                subtitle="Low-cost index tracking funds for your portfolio"
                icon={<FiActivity className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by name or symbol (e.g. NIFTYBEES)..."
                filters={[
                    { label: 'Category', value: selectedCategory, icon: <FiPieChart />, options: categories }
                ]}
                onFilterChange={(_, value) => setSelectedCategory(value)}
                currentFilters={{
                    'Category': selectedCategory
                }}
            />
            
            <div className="mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Optimizing Index View...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{error}</h3>
                    </div>
                ) : etfs.length > 0 ? (
                    etfs.map((etf) => (
                        <AssetCard
                            key={etf.id}
                            symbol={etf.symbol}
                            name={etf.name}
                            subtitle={etf.fundHouse}
                            price={etf.price}
                            change={etf.changePercent}
                            changePercent={true}
                            isPositive={etf.change >= 0}
                            tags={[etf.sector]}
                            detailsRoute={`/etfs/${etf.id}`}
                            Icon={FiActivity}
                            analyzeLabel="Analyze ETF"
                            metrics={[
                                { label: 'Expense Ratio', value: `${etf.expenseRatio}%` },
                                { label: 'AUM', value: `₹${etf.aum}` }
                            ]}
                            watchlistItem={{
                                item_id: etf.id.toString(),
                                item_name: etf.name,
                                symbol: etf.symbol,
                                item_type: 'etf'
                            }}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">📂</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No matching ETFs</h3>
                        <p className="text-indigo-900/30 font-medium mb-6">Try another category or search term</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                            className="px-6 py-3 bg-indigo-50 text-indigo-600 font-black rounded-xl hover:bg-indigo-100 transition-colors uppercase tracking-widest text-xs"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default ETFs;

