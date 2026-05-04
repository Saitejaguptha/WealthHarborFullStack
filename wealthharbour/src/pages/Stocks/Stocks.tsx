import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiActivity, FiPieChart } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SECTORS, MARKET_CAPS } from '../../types/stock';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { StockService, GuideService } from '../../services/api';

const Stocks: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCap, setSelectedCap] = useState('All');
    const [selectedSector, setSelectedSector] = useState('All');

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // Load Guide
    const { data: guide } = useQuery({
        queryKey: ['stocks-guide'],
        queryFn: () => GuideService.getGuide('stocks'),
        staleTime: Infinity,
    });

    // Infinite Query for Stocks
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['stocks', searchTerm, selectedCap, selectedSector],
        queryFn: ({ pageParam = 0 }) => StockService.getStocks({ 
            cap: selectedCap, 
            sector: selectedSector,
            search: searchTerm,
            limit: 12,
            offset: pageParam,
        }),
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.offset + (lastPage.stocks?.length || 0);
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
        if (label === 'Market Cap') setSelectedCap(value);
        if (label === 'Sector') setSelectedSector(value);
    };

    const stocks = data?.pages.flatMap(page => page.stocks || []) || [];

    return (
        <PageShell className="animate-in fade-in duration-700">
            <PageHeader 
                title="Stock Explorer"
                subtitle="Monitor and analyze top Indian stocks"
                icon={<FiActivity className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by name or symbol (e.g. RELIANCE)..."
                filters={[
                    { label: 'Market Cap', value: selectedCap, icon: <FiActivity />, options: ['All', ...MARKET_CAPS] },
                    { label: 'Sector', value: selectedSector, icon: <FiPieChart />, options: ['All', ...SECTORS] }
                ]}
                onFilterChange={handleFilterChange}
                currentFilters={{
                    'Market Cap': selectedCap,
                    'Sector': selectedSector
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
                        <h3 className="text-xl font-black text-rose-600">{(error as any)?.message || 'Failed to load stocks'}</h3>
                    </div>
                ) : stocks.length > 0 ? (
                    <>
                        {stocks.map((stock) => (
                            <AssetCard
                                key={stock.id}
                                symbol={stock.symbol}
                                name={stock.name}
                                price={stock.price}
                                change={stock.changePercent}
                                changePercent={true}
                                isPositive={(stock.change || 0) >= 0}
                                tags={[stock.marketCap, stock.sector]}
                                detailsRoute={`/stocks/${stock.symbol.toLowerCase()}`}
                                Icon={FiTrendingUp}
                                watchlistItem={{
                                    item_id: stock.symbol,
                                    item_name: stock.name,
                                    symbol: stock.symbol,
                                    item_type: 'stock'
                                }}
                            />
                        ))}

                        {/* Loading trigger and state */}
                        <div ref={ref} className="col-span-full py-12 flex justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                                    <p className="mt-2 text-indigo-900/40 text-[8px] font-black uppercase tracking-widest">Loading More Stocks...</p>
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
                        <div className="text-8xl mb-6 opacity-10">🔍</div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">No matching stocks</h3>
                        <p className="text-indigo-900/30 font-medium mb-6">Try a different search term or filter</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCap('All');
                                setSelectedSector('All');
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

export default Stocks;
