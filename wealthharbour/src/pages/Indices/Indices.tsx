import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiLayers, FiGlobe } from 'react-icons/fi';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { IndexService } from '../../services/api';
import type { MarketIndex } from '../../types/indexData';

const Indices: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedExchange, setSelectedExchange] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [exchanges, setExchanges] = useState<string[]>(['All']);
    const [filteredIndices, setFilteredIndices] = useState<MarketIndex[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGuide = async () => {
        const { GuideService } = await import('../../services/api');
        const data = await GuideService.getGuide('indices');
        if (data) setGuide(data);
    };

    const loadFilters = async () => {
        try {
            const data = await IndexService.getFilters();
            if (data) {
                setCategories(data.categories || ['All']);
                setExchanges(data.exchanges || ['All']);
            }
        } catch (err) {
            console.error('Failed to load filters:', err);
        }
    };

    const loadIndices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await IndexService.getAllIndices({
                search: searchTerm,
                category: selectedCategory,
                exchange: selectedExchange
            });
            setFilteredIndices(data);
        } catch (err) {
            setError('Failed to load indices. Please try again.');
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
            loadIndices();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, selectedExchange]);

    return (
        <PageShell className="animate-in fade-in duration-700">
            <PageHeader 
                title="Market Indices"
                subtitle="Track major benchmark indices and sectoral movements"
                icon={<FiTrendingUp className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search indices (e.g. NIFTY 50)..."
                filters={[
                    { label: 'Category', value: selectedCategory, icon: <FiLayers />, options: categories },
                    { label: 'Exchange', value: selectedExchange, icon: <FiGlobe />, options: exchanges }
                ]}
                onFilterChange={(label, val) => {
                    if (label === 'Category') setSelectedCategory(val);
                    if (label === 'Exchange') setSelectedExchange(val);
                }}
                currentFilters={{ 'Category': selectedCategory, 'Exchange': selectedExchange }}
            />
            
            <div className="mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Updating Market View...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{error}</h3>
                    </div>
                ) : filteredIndices.length > 0 ? (
                    filteredIndices.map((idx) => (
                        <AssetCard
                            key={idx.name}
                            name={idx.name}
                            price={idx.value}
                            change={idx.change}
                            changePercent={false}
                            isPositive={idx.isPositive}
                            tags={[idx.exchange]}
                            detailsRoute={`/index-details/${encodeURIComponent(idx.name)}`}
                            Icon={FiTrendingUp}
                            analyzeLabel="View Index"
                            watchlistItem={{
                                item_id: idx.name,
                                item_name: idx.name,
                                symbol: idx.name,
                                item_type: 'index'
                            }}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">📉</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No matching indices</h3>
                        <p className="text-indigo-900/30 font-medium mb-6">Try adjusting your filters</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setSelectedExchange('All');
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

export default Indices;

