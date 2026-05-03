import React, { useState, useEffect } from 'react';
import { FiActivity, FiPieChart, FiBriefcase, FiLayers } from 'react-icons/fi';
import { type MutualFund } from '../../types/mutualFund';
import AssetCard from '../../components/common/AssetCard/AssetCard';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import { MutualFundService, GuideService } from '../../services/api';

const MutualFunds: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedHouse, setSelectedHouse] = useState<string>('All');
    const [selectedPlan, setSelectedPlan] = useState<string>('All');
    
    const [categories, setCategories] = useState<string[]>(['All']);
    const [houses, setHouses] = useState<string[]>(['All']);
    const [plans, setPlans] = useState<string[]>(['All']);

    const [funds, setFunds] = useState<MutualFund[]>([]);
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGuide = async () => {
        const data = await GuideService.getGuide('mf');
        if (data) setGuide(data);
    };

    const loadFilters = async () => {
        try {
            const data = await MutualFundService.getFilters();
            if (data) {
                setCategories(data.categories || ['All']);
                setHouses(data.fundHouses || ['All']);
                setPlans(data.planTypes || ['All']);
            }
        } catch (err) {
            console.error('Failed to load filters:', err);
        }
    };

    const loadFunds = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await MutualFundService.getMutualFunds({
                amc_name: selectedHouse,
                category: selectedCategory,
                plan_type: selectedPlan
            });
            
            const filtered = data.filter(fund => 
                (fund.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                (fund.fundHouse || '').toLowerCase().includes(searchTerm.toLowerCase())
            );

            
            setFunds(filtered);
        } catch (err) {
            setError('Failed to load mutual funds');
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
            loadFunds();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, selectedHouse, selectedPlan]);

    const handleFilterChange = (label: string, value: string) => {
        if (label === 'Category') setSelectedCategory(value);
        if (label === 'Fund House') setSelectedHouse(value);
        if (label === 'Plan Type') setSelectedPlan(value);
    };

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
                    <div className="col-span-full flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Scanning Portfolio Options...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-black text-rose-600">{error}</h3>
                    </div>
                ) : funds.length > 0 ? (
                    funds.map((fund) => (
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
                    ))
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

