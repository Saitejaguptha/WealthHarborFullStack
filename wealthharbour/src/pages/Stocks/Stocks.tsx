import React, { useState, useMemo, useEffect } from 'react';
import { FiTrendingUp, FiActivity, FiPieChart } from 'react-icons/fi';
import { type Stock, SECTORS, MARKET_CAPS } from '../../types/stock';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { StockService } from '../../services/api';

const Stocks: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCap, setSelectedCap] = useState('All');
    const [selectedSector, setSelectedSector] = useState('All');
    const [allStocks, setAllStocks] = useState<Stock[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { GuideService } = await import('../../services/api');
            const data = await GuideService.getGuide('stocks');
            if (data) setGuide(data);
        };
        load();
    }, []);

    useEffect(() => {
        const loadStocks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await StockService.getStocks({ 
                    cap: selectedCap, 
                    sector: selectedSector 
                });
                setAllStocks(data);
            } catch (err) {
                console.error('Failed to load stocks:', err);
                setError('Failed to load stocks. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadStocks();
    }, [selectedCap, selectedSector]);

    const filteredStocks = useMemo(() => {
        return allStocks.filter(stock => {
            return stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, allStocks]);

    const handleFilterChange = (label: string, value: string) => {
        if (label === 'Market Cap') setSelectedCap(value);
        if (label === 'Sector') setSelectedSector(value);
    };

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
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Fetching Assets...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{error}</h3>
                    </div>
                ) : filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                        <AssetCard
                            key={stock.id}
                            symbol={stock.symbol}
                            name={stock.name}
                            price={stock.price}
                            change={stock.changePercent}
                            changePercent={true}
                            isPositive={stock.change >= 0}
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
                    ))
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
