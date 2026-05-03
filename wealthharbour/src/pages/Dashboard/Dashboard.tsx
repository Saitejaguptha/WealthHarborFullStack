import React from 'react';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { FiZap, FiTrendingUp, FiActivity } from 'react-icons/fi';
import HorizonCard from '../../components/common/AssetCard/HorizonCard';
import type { HorizonData } from '../../components/common/AssetCard/HorizonCard';
import { useAppSelector } from '../../store/hooks';
import { CardSkeleton } from '../../components/common/Skeleton';

const Dashboard: React.FC = () => {
    const { quizData } = useAppSelector((state) => state.preferences);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate initial data fetch
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Mock data for Top 3 Cards
    const getRecommendations = () => {
        const base = [
            {
                symbol: 'RELIANCE',
                name: 'Reliance Industries',
                price: 2950.45,
                change: 1.25,
                isPositive: true,
                shortTerm: { risk: 'G', expectedReturn: '5-8%', taxation: 'STCG: 15% if sold before 1 year' } as HorizonData,
                midTerm: { risk: 'Y', expectedReturn: '12-15%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                longTerm: { risk: 'G', expectedReturn: '18-22%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                tags: ['Energy', 'Nifty 50', 'Large Cap']
            },
            {
                symbol: 'HDFCBANK',
                name: 'HDFC Bank Ltd',
                price: 1445.60,
                change: -0.45,
                isPositive: false,
                shortTerm: { risk: 'Y', expectedReturn: '3-5%', taxation: 'STCG: 15% if sold before 1 year' } as HorizonData,
                midTerm: { risk: 'G', expectedReturn: '10-12%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                longTerm: { risk: 'G', expectedReturn: '15-18%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                tags: ['Banking', 'Nifty 50', 'Large Cap']
            },
            {
                symbol: 'TATASTEEL',
                name: 'Tata Steel Ltd',
                price: 154.20,
                change: 3.15,
                isPositive: true,
                shortTerm: { risk: 'R', expectedReturn: '8-12%', taxation: 'STCG: 15% if sold before 1 year' } as HorizonData,
                midTerm: { risk: 'Y', expectedReturn: '14-18%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                longTerm: { risk: 'Y', expectedReturn: '20-25%', taxation: 'LTCG: 10% on gains above 1L' } as HorizonData,
                tags: ['Metals', 'Nifty 50', 'Mid Cap']
            }
        ];

        if (quizData?.assetClass === 'Mutual Fund') {
            return base.map(b => ({ ...b, name: `${b.name} Fund`, tags: ['Mutual Fund', ...b.tags] }));
        }
        return base;
    };

    const topAssets = getRecommendations();

    return (
        <PageShell className="pb-32">
            <PageHeader 
                title="Smart Feed"
                subtitle={quizData ? `Personalized insights based on your ${quizData.riskTolerance || 'Moderate'} risk profile.` : "Top performing assets and market volatility alerts."}
                icon={<FiZap className="text-amber-500" />}
            />

            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-indigo-600 rounded-full" />
                    <h2 className="text-2xl font-black text-indigo-950 tracking-tight">Top Recommendations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <>
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                        </>
                    ) : (
                        topAssets.map((asset) => (
                            <HorizonCard key={asset.symbol} {...asset} />
                        ))
                    )}
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-colors" />
                    <div className="relative z-10">
                        <FiTrendingUp className="text-4xl text-emerald-400 mb-6" />
                        <h3 className="text-3xl font-black mb-4 tracking-tighter">Market Momentum</h3>
                        <p className="text-indigo-200 text-sm leading-relaxed mb-8 max-w-md">
                            The current market sentiment is <span className="text-emerald-400 font-bold">Bullish</span>. 
                            Large-cap banking stocks are leading the rally with strong FII inflows.
                        </p>
                        <button className="px-8 py-3 bg-white text-indigo-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                            View Deep Analysis
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-xl shadow-indigo-100/20">
                    <FiActivity className="text-4xl text-indigo-600 mb-6" />
                    <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter">Volatility Alert</h3>
                    <p className="text-indigo-900/60 text-sm leading-relaxed mb-8 max-w-md">
                        Metals and Commodities are experiencing <span className="text-rose-500 font-bold">High Volatility</span> due to global macro shifts. 
                        Adjust your short-term positions accordingly.
                    </p>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        Risk Assessment
                    </button>
                </div>
            </div>
        </PageShell>
    );
};

export default Dashboard;
