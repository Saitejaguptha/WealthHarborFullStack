import React, { useState, useEffect } from 'react';
import { FiActivity, FiPieChart } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { ETFService, GuideService } from '../../services/api';

const ETFs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // Load Filters
    const { data: filterData } = useQuery({
        queryKey: ['etf-filters'],
        queryFn: () => ETFService.getFilters(),
        staleTime: Infinity,
    });

    const categories = filterData?.categories || ['All'];

    // Load Guide
    const { data: guide } = useQuery({
        queryKey: ['etfs-guide'],
        queryFn: () => GuideService.getGuide('etfs'),
        staleTime: Infinity,
    });

    // Infinite Query for ETFs
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['etfs', searchTerm, selectedCategory],
        queryFn: ({ pageParam = 0 }) => ETFService.getETFs({
            category: selectedCategory,
            search: searchTerm,
            limit: 12,
            offset: pageParam,
        }),
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.offset + (lastPage.etfs?.length || 0);
            return nextOffset < lastPage.total ? nextOffset : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleFilterChange = (_: string, value: string) => {
        setSelectedCategory(value);
    };

    const etfs = data?.pages.flatMap(page => page.etfs || []) || [];

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
                onFilterChange={handleFilterChange}
                currentFilters={{
                    'Category': selectedCategory
                }}
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
                        <h3 className="text-xl font-black text-rose-600">{(error as any)?.message || 'Failed to load ETFs'}</h3>
                    </div>
                ) : etfs.length > 0 ? (
                    <>
                        {etfs.map((etf) => (
                            <AssetCard
                                key={etf.id}
                                symbol={etf.symbol}
                                name={etf.name}
                                subtitle={etf.fundHouse}
                                price={etf.price}
                                change={etf.changePercent}
                                changePercent={true}
                                isPositive={(etf.change || 0) >= 0}
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
                        ))}

                        {/* Loading trigger and state */}
                        <div ref={ref} className="col-span-full py-12 flex justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                                    <p className="mt-2 text-indigo-900/40 text-[8px] font-black uppercase tracking-widest">Loading More ETFs...</p>
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
