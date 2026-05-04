import React, { useState, useEffect } from 'react';
import { FiActivity, FiPieChart, FiBriefcase, FiLayers, FiSearch } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { MutualFundService, GuideService } from '../../services/api';

const MutualFunds: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedHouse, setSelectedHouse] = useState<string>('All');
    const [selectedPlan, setSelectedPlan] = useState<string>('All');
    
    const { ref, inView } = useInView({
        threshold: 0.1, // Trigger when 10% visible (close to 80% window reach if bottom is viewed)
    });

    // Load Filters
    const { data: filterData } = useQuery({
        queryKey: ['mf-filters'],
        queryFn: () => MutualFundService.getFilters(),
        staleTime: Infinity,
    });

    const categories = filterData?.categories || ['All'];
    const houses = filterData?.fundHouses || ['All'];
    const plans = filterData?.planTypes || ['All'];

    // Load Guide
    const { data: guide } = useQuery({
        queryKey: ['mf-guide'],
        queryFn: () => GuideService.getGuide('mf'),
        staleTime: Infinity,
    });

    // Infinite Query for Funds
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['mutual-funds', searchTerm, selectedCategory, selectedHouse, selectedPlan],
        queryFn: ({ pageParam = 0 }) => MutualFundService.getMutualFunds({
            amc_name: selectedHouse,
            category: selectedCategory,
            plan_type: selectedPlan,
            search: searchTerm,
            limit: 12,
            offset: pageParam,
        }),
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.offset + lastPage.funds.length;
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
        if (label === 'Fund House') setSelectedHouse(value);
        if (label === 'Plan Type') setSelectedPlan(value);
    };

    const funds = data?.pages.flatMap(page => page.funds) || [];

    return (
        <PageShell className="animate-in fade-in duration-700">
            <PageHeader 
                title="Mutual Funds"
                subtitle="Explore top-rated mutual funds curated for your goals"
                icon={<FiActivity className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search funds or AMC (e.g. Parag Parikh)..."
                filters={[
                    { label: 'Category', value: selectedCategory, icon: <FiPieChart />, options: categories },
                    { label: 'Fund House', value: selectedHouse, icon: <FiBriefcase />, options: houses },
                    { label: 'Plan Type', value: selectedPlan, icon: <FiLayers />, options: plans }
                ]}
                onFilterChange={handleFilterChange}
                currentFilters={{
                    'Category': selectedCategory,
                    'Fund House': selectedHouse,
                    'Plan Type': selectedPlan
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
                        <h3 className="text-xl font-black text-rose-600">{(error as any)?.message || 'Failed to load mutual funds'}</h3>
                    </div>
                ) : funds.length > 0 ? (
                    <>
                        {funds.map((fund) => (
                            <AssetCard
                                key={fund.id}
                                name={fund.name}
                                subtitle={fund.fundHouse}
                                price={fund.nav}
                                change={fund.return1Y}
                                changePercent={true}
                                isPositive={(fund.return1Y || 0) >= 0}
                                tags={[fund.sector, `${fund.rating}★`, fund.plan_type || 'Direct']}
                                detailsRoute={`/mutual-funds/${fund.id}`}
                                Icon={FiActivity}
                                analyzeLabel="Analyze Fund"
                                metrics={[
                                    { label: 'Exp. Ratio', value: `${fund.expenseRatio}%` },
                                    { label: 'AUM', value: fund.aum }
                                ]}
                                watchlistItem={{
                                    item_id: fund.id.toString(),
                                    item_name: fund.name,
                                    symbol: fund.id.toString(),
                                    item_type: 'mutual-fund'
                                }}
                            />
                        ))}
                        
                        {/* Loading trigger and state */}
                        <div ref={ref} className="col-span-full py-12 flex justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                                    <p className="mt-2 text-indigo-900/40 text-[8px] font-black uppercase tracking-widest">Loading More Funds...</p>
                                </div>
                            ) : hasNextPage ? (
                                <div className="h-4 w-full" /> // Spacer for observer
                            ) : (
                                <p className="text-indigo-900/30 text-[10px] font-black uppercase tracking-widest">You've reached the end of the list</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-8xl mb-6 opacity-10">💰</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No matching funds</h3>
                        <p className="text-indigo-900/30 font-medium mb-6">Try different filters to find the right fund</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setSelectedHouse('All');
                                setSelectedPlan('All');
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

export default MutualFunds;

