import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiLayers, FiGlobe } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { IndexService, GuideService } from '../../services/api';

const Indices: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedExchange, setSelectedExchange] = useState<string>('All');

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // Load Filters
    const { data: filterData } = useQuery({
        queryKey: ['index-filters'],
        queryFn: () => IndexService.getFilters(),
        staleTime: Infinity,
    });

    const categories = filterData?.categories || ['All'];
    const exchanges = filterData?.exchanges || ['All'];

    // Load Guide
    const { data: guide } = useQuery({
        queryKey: ['indices-guide'],
        queryFn: () => GuideService.getGuide('indices'),
        staleTime: Infinity,
    });

    // Infinite Query for Indices
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['indices', searchTerm, selectedCategory, selectedExchange],
        queryFn: ({ pageParam = 0 }) => IndexService.getAllIndices({
            search: searchTerm,
            category: selectedCategory,
            exchange: selectedExchange,
            limit: 12,
            offset: pageParam,
        }),
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.offset + (lastPage.indices?.length || 0);
            return nextOffset < lastPage.total ? nextOffset : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleFilterChange = (label: string, value: string) => {
        if (label === 'Category') setSelectedCategory(value);
        if (label === 'Exchange') setSelectedExchange(value);
    };

    const indices = data?.pages.flatMap(page => page.indices || []) || [];

    return (
        <PageShell className="animate-in fade-in duration-700">
            <PageHeader 
                title="Market Indices"
                subtitle="Track major benchmarks and sectoral movements"
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
                onFilterChange={handleFilterChange}
                currentFilters={{ 'Category': selectedCategory, 'Exchange': selectedExchange }}
            />
            
            <div className="mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))
                ) : isError ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{(error as any)?.message || 'Failed to load indices'}</h3>
                    </div>
                ) : indices.length > 0 ? (
                    <>
                        {indices.map((idx) => (
                            <AssetCard
                                key={idx.name}
                                name={idx.name}
                                price={idx.value}
                                change={idx.change}
                                changePercent={true}
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
                        ))}

                        {/* Loading trigger and state */}
                        <div ref={ref} className="col-span-full py-12 flex justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                                    <p className="mt-2 text-indigo-900/40 text-[8px] font-black uppercase tracking-widest">Loading More Indices...</p>
                                </div>
                            ) : hasNextPage ? (
                                <div className="h-4 w-full" />
                            ) : (
                                <p className="text-indigo-900/30 text-[10px] font-black uppercase tracking-widest">You've reached the end of the list</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">📈</div>
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
