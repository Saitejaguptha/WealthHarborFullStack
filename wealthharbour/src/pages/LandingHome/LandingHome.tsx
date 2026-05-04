import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiChevronDown,
    FiChevronUp,
    FiInfo,
    FiTrendingUp,
    FiActivity,
    FiLayers,
    FiBriefcase,
    FiDatabase,
    FiShield,
    FiPieChart,
    FiArrowRight
} from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';

interface AssetData {
    name: string;
    path: string;
    icon: React.ReactNode;
    shortTerm: { span: string; returns: string };
    midTerm: { span: string; returns: string };
    longTerm: { span: string; returns: string };
    description: string;
    howToStart: string;
}

const assetData: AssetData[] = [
    {
        name: 'Stocks',
        path: '/stocks',
        icon: <FiTrendingUp />,
        shortTerm: { span: '6-12 Months', returns: '5-12%' },
        midTerm: { span: '1-3 Years', returns: '12-18%' },
        longTerm: { span: '5+ Years', returns: '18-25%' },
        description: "Direct ownership in a company. High growth potential but requires active monitoring.",
        howToStart: "Open a Demat account, research companies, and start with large-cap stocks."
    },
    {
        name: 'Mutual Fund',
        path: '/mutual-funds',
        icon: <FiBriefcase />,
        shortTerm: { span: '1-3 Years', returns: '4-9%' },
        midTerm: { span: '3-5 Years', returns: '10-14%' },
        longTerm: { span: '7+ Years', returns: '14-18%' },
        description: "Pooled investment managed by professionals. Ideal for diversification and long-term goals.",
        howToStart: "Choose a fund based on risk, start a SIP, and review performance annually."
    },
    {
        name: 'IPO',
        path: '/ipo',
        icon: <FiLayers />,
        shortTerm: { span: 'Listing (7-10 Days)', returns: '10-40%' },
        midTerm: { span: '1-2 Years', returns: '15-25%' },
        longTerm: { span: '3+ Years', returns: 'Variable' },
        description: "Initial Public Offering. Opportunity to buy shares before they list on exchanges.",
        howToStart: "Apply via ASBA through your bank or broker during the subscription period."
    },
    {
        name: 'Indices',
        path: '/indices',
        icon: <FiActivity />,
        shortTerm: { span: '6-18 Months', returns: '3-8%' },
        midTerm: { span: '3-5 Years', returns: '8-12%' },
        longTerm: { span: '10+ Years', returns: '12-15%' },
        description: "Market benchmarks like Nifty 50 or Sensex. Low cost and tracks overall market growth.",
        howToStart: "Invest via Index Funds or ETFs that mimic the target index."
    },
    {
        name: 'Intraday Stocks',
        path: '/intraday-stocks',
        icon: <FiTrendingUp />,
        shortTerm: { span: 'Daily', returns: '1-5% (Daily)' },
        midTerm: { span: 'N/A', returns: 'N/A' },
        longTerm: { span: 'N/A', returns: 'N/A' },
        description: "Buying and selling on the same day. High risk, high reward, requires technical expertise.",
        howToStart: "Learn technical analysis, set strict stop-losses, and start with small capital."
    },
    {
        name: 'F&O Options',
        path: '/f-and-o',
        icon: <FiLayers />,
        shortTerm: { span: 'Expiry (Weekly/Monthly)', returns: 'High Leverage' },
        midTerm: { span: 'N/A', returns: 'N/A' },
        longTerm: { span: 'N/A', returns: 'N/A' },
        description: "Derivatives used for hedging or speculation. Extremely high risk/reward.",
        howToStart: "Understand option Greeks, margins, and only use capital you can afford to lose."
    },
    {
        name: 'Commodities',
        path: '/commodities',
        icon: <FiDatabase />,
        shortTerm: { span: '1-6 Months', returns: '5-15%' },
        midTerm: { span: '1-2 Years', returns: '10-18%' },
        longTerm: { span: '3+ Years', returns: '12-20%' },
        description: "Trading in physical goods like Oil, Gas, and Agri-products. Influenced by global supply.",
        howToStart: "Activate MCX segment on your broker and follow global commodity trends."
    },
    {
        name: 'Gold & Silver',
        path: '/gold-silver',
        icon: <FiLayers />,
        shortTerm: { span: '1-2 Years', returns: '3-7%' },
        midTerm: { span: '3-7 Years', returns: '8-12%' },
        longTerm: { span: '10+ Years', returns: '10-14%' },
        description: "Safe-haven assets. Protects against inflation and economic downturns.",
        howToStart: "Buy Physical Gold, SGBs (Sovereign Gold Bonds), or Gold ETFs."
    },
    {
        name: 'Securities Bond',
        path: '/securities-bond',
        icon: <FiShield />,
        shortTerm: { span: '1-3 Years', returns: '6-8%' },
        midTerm: { span: '3-7 Years', returns: '7.5-9%' },
        longTerm: { span: '7-15 Years', returns: '8.5-10%' },
        description: "Fixed income instruments. Lower risk than stocks, provides regular interest.",
        howToStart: "Invest via secondary market or primary issues from Govt/Corporates."
    },
    {
        name: 'REITS',
        path: '/reits',
        icon: <FiPieChart />,
        shortTerm: { span: '1-3 Years', returns: '5-8%' },
        midTerm: { span: '3-5 Years', returns: '8-11%' },
        longTerm: { span: '5+ Years', returns: '11-15%' },
        description: "Real Estate Investment Trusts. Invest in commercial real estate with small amounts.",
        howToStart: "Buy units through stock exchange like regular shares."
    },
    {
        name: 'Indian Forecast',
        path: '/forecast',
        icon: <FiActivity />,
        shortTerm: { span: '1-2 Years', returns: '7-10%' },
        midTerm: { span: '3-5 Years', returns: '10-15%' },
        longTerm: { span: '5-10 Years', returns: '12-18%' },
        description: "Macro-economic and market projections for the Indian economy.",
        howToStart: "Review GDP trends, inflation data, and sectoral outlooks in our dedicated module."
    }
];

const LandingHome: React.FC = () => {
    const navigate = useNavigate();
    const [disclaimerExpanded, setDisclaimerExpanded] = useState(true);
    const [openGuides, setOpenGuides] = useState<string[]>(assetData.map(a => a.name));

    const toggleGuide = (name: string) => {
        if (openGuides.includes(name)) {
            setOpenGuides(openGuides.filter(n => n !== name));
        } else {
            setOpenGuides([...openGuides, name]);
        }
    };

    const scrollToAsset = (name: string) => {
        // Ensure the guide is open
        if (!openGuides.includes(name)) {
            setOpenGuides([...openGuides, name]);
        }
        
        // Short delay to allow DOM update if needed, then scroll
        setTimeout(() => {
            const element = document.getElementById(`guide-${name.toLowerCase().replace(/\s+/g, '-')}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    return (
        <PageShell className="pb-32">
            {/* Disclaimer Section */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-[2rem] overflow-hidden shadow-sm">
                <button
                    onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
                    className="w-full p-6 flex items-center justify-between hover:bg-amber-100/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <FiInfo className="text-amber-600 text-xl" />
                        <h3 className="font-black text-amber-900 uppercase tracking-widest text-xs">Statutory Disclosure & Guidelines</h3>
                    </div>
                    {disclaimerExpanded ? <FiChevronUp className="text-amber-600" /> : <FiChevronDown className="text-amber-600" />}
                </button>
                <AnimatePresence>
                    {disclaimerExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 overflow-hidden"
                        >
                            <div className="pt-2 text-amber-800 text-sm leading-relaxed space-y-4">
                                <p>
                                    <strong>Investment Risks:</strong> Trading and investing in the securities market involve significant risks.
                                    Returns are not guaranteed, and you may lose some or all of your principal capital.
                                </p>
                                <p>
                                    <strong>Regulatory Compliance:</strong> We are not a SEBI registered investment advisor.
                                    All information provided is for educational purposes only. Please consult a certified financial planner before making any investment decisions.
                                </p>
                                <p>
                                    <strong>Data Accuracy:</strong> While we strive for accuracy, market data can be delayed or incorrect.
                                    Past performance is not indicative of future results.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Returns Table Section */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-indigo-600 rounded-full" />
                    <h2 className="text-2xl font-black text-indigo-950 tracking-tight uppercase">Asset Performance Matrix</h2>
                </div>

                {/* ── Desktop: Table ── */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full border-separate border-spacing-y-3 min-w-[800px]">
                        <thead>
                            <tr className="text-indigo-400 text-[10px] uppercase tracking-widest font-black">
                                <th className="px-6 py-4 text-left">Asset Type</th>
                                <th className="px-6 py-4 text-left">Short Term</th>
                                <th className="px-6 py-4 text-left">Mid Term</th>
                                <th className="px-6 py-4 text-left">Long Term</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assetData.map((asset) => (
                                <tr key={asset.name} className="bg-white hover:bg-indigo-50/50 transition-colors group cursor-pointer" onClick={() => scrollToAsset(asset.name)}>
                                    <td className="px-6 py-5 rounded-l-[1.5rem] border-y border-l border-indigo-50">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                                {asset.icon}
                                            </span>
                                            <span className="font-black text-indigo-950 text-sm">{asset.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 border-y border-indigo-50">
                                        <div className="flex flex-col">
                                            <span className="text-rose-500 font-bold text-sm">{asset.shortTerm.returns}</span>
                                            <span className="text-indigo-400 text-[10px] uppercase tracking-tighter">{asset.shortTerm.span}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 border-y border-indigo-50">
                                        <div className="flex flex-col">
                                            <span className="text-amber-500 font-bold text-sm">{asset.midTerm.returns}</span>
                                            <span className="text-indigo-400 text-[10px] uppercase tracking-tighter">{asset.midTerm.span}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 rounded-r-[1.5rem] border-y border-r border-indigo-50">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-600 font-bold text-sm">{asset.longTerm.returns}</span>
                                            <span className="text-indigo-400 text-[10px] uppercase tracking-tighter">{asset.longTerm.span}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile: Stacked Cards ── */}
                <div className="md:hidden space-y-3">
                    {assetData.map((asset) => (
                        <div
                            key={asset.name}
                            className="bg-white rounded-2xl border border-indigo-50 overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                            onClick={() => scrollToAsset(asset.name)}
                        >
                            {/* Asset header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-indigo-50/50">
                                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm text-sm">
                                    {asset.icon}
                                </span>
                                <span className="font-black text-indigo-950 text-sm">{asset.name}</span>
                            </div>
                            {/* Returns grid */}
                            <div className="grid grid-cols-3 divide-x divide-indigo-50/50">
                                <div className="px-3 py-3 text-center">
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Short</p>
                                    <p className="text-rose-500 font-black text-sm">{asset.shortTerm.returns}</p>
                                    <p className="text-indigo-400 text-[8px] uppercase mt-0.5">{asset.shortTerm.span}</p>
                                </div>
                                <div className="px-3 py-3 text-center">
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Mid</p>
                                    <p className="text-amber-500 font-black text-sm">{asset.midTerm.returns}</p>
                                    <p className="text-indigo-400 text-[8px] uppercase mt-0.5">{asset.midTerm.span}</p>
                                </div>
                                <div className="px-3 py-3 text-center">
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Long</p>
                                    <p className="text-emerald-600 font-black text-sm">{asset.longTerm.returns}</p>
                                    <p className="text-indigo-400 text-[8px] uppercase mt-0.5">{asset.longTerm.span}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interactive Beginner Guide Section - Vertical List Full Width */}
            <div className="mt-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-indigo-600 rounded-full" />
                    <h2 className="text-2xl font-black text-indigo-950 tracking-tight uppercase">Basic Intro</h2>
                </div>

                <div className="space-y-4">
                    {assetData.map((asset) => {
                        const isOpen = openGuides.includes(asset.name);
                        const assetId = `guide-${asset.name.toLowerCase().replace(/\s+/g, '-')}`;
                        return (
                            <div
                                key={asset.name}
                                id={assetId}
                                className={`bg-white border border-indigo-50 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? 'ring-1 ring-indigo-100 shadow-md' : ''}`}
                            >
                                <button
                                    onClick={() => toggleGuide(asset.name)}
                                    className="w-full p-8 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${isOpen ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
                                            {asset.icon}
                                        </span>
                                        <div>
                                            <h3 className="font-black text-indigo-950 text-lg tracking-tight">{asset.name}</h3>
                                            {!isOpen && <p className="text-indigo-400 text-xs mt-1 line-clamp-1">{asset.description}</p>}
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-300 group-hover:text-indigo-600'}`}>
                                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-10 space-y-8">
                                                <div className="h-px bg-indigo-50" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div>
                                                        <h4 className="text-[10px] uppercase tracking-widest font-black text-indigo-400 mb-3">Asset Definition</h4>
                                                        <p className="text-indigo-900/70 text-base leading-relaxed">{asset.description}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] uppercase tracking-widest font-black text-indigo-400 mb-3">Implementation Guide</h4>
                                                        <p className="text-indigo-900/70 text-base leading-relaxed">{asset.howToStart}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-950 rounded-2xl p-6 flex items-center justify-between text-white shadow-xl shadow-indigo-100">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-indigo-300">Explore {asset.name}</span>
                                                        <span className="text-sm font-bold">Deep Dive into {asset.name} Analysis</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(asset.path);
                                                        }}
                                                        className="bg-white text-indigo-950 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg"
                                                    >
                                                        Get Started
                                                        <FiArrowRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Call to Action */}
            <div className="mt-24 bg-indigo-950 rounded-[3rem] p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Still Confused Where to Start?</h2>
                    <p className="text-indigo-200 mb-10 max-w-2xl mx-auto text-lg">
                        Take our 1-minute financial personality test and let our AI architect build the perfect portfolio for you.
                    </p>
                    <button
                        onClick={() => navigate('/suggestions')}
                        className="px-12 py-5 bg-white text-indigo-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center gap-4 mx-auto"
                    >
                        Know More & Start Quiz
                        <FiArrowRight className="text-xl" />
                    </button>
                </div>
            </div>
        </PageShell>
    );
};

export default LandingHome;
