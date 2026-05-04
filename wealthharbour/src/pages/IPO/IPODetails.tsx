import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiLayers, FiAlertTriangle, FiDollarSign, FiUsers, 
    FiBarChart2, FiBriefcase, FiPieChart, FiTrendingUp, FiFileText, 
    FiCheckCircle, FiActivity, FiGlobe, FiDatabase, FiTarget
} from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';

const IPODetails: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();

    const [ipoDetails, setIpoDetails] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        import('../../services/api').then(({ IPOService }) => {
            if (name) {
                IPOService.getIPODetails(name).then(data => {
                    setIpoDetails(data);
                    setIsLoading(false);
                });
            }
        });
    }, [name]);

    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        }
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <button
                onClick={() => navigate('/ipo')}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-600 font-bold mb-6 transition-colors uppercase tracking-widest text-xs"
            >
                <FiArrowLeft size={16} /> Back to IPOs
            </button>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : !ipoDetails ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-indigo-950">IPO Not Found</h2>
                </div>
            ) : (
                <>
                    {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-indigo-50 pb-8 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${ipoDetails.status === 'Open' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>
                            {ipoDetails.status}
                        </span>
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${getRiskColor(ipoDetails.riskStatus)}`}>
                            <FiAlertTriangle size={12} /> {ipoDetails.riskStatus} Risk
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <FiLayers />
                        </div>
                        {ipoDetails.name}
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-indigo-900/40 font-bold uppercase tracking-widest text-xs mb-1">Price Band</p>
                    <p className="text-3xl font-black text-indigo-950">{ipoDetails.priceBand}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="card-luxury p-8">
                        <h2 className="text-2xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                            <FiBriefcase className="text-indigo-500" /> About the Company
                        </h2>
                        <p className="text-indigo-950/70 font-medium leading-relaxed">
                            {ipoDetails.about}
                        </p>
                    </div>

                    {/* GMP & Listing Gains */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {ipoDetails.status === 'Listed' ? (
                            <div className="card-luxury p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 sm:col-span-2">
                                <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                                    <FiTrendingUp className="text-emerald-500" /> Listing Performance
                                </h2>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                                        <p className="text-indigo-900/40 font-bold uppercase tracking-widest text-[10px] mb-1">Listing Price</p>
                                        <p className="text-2xl font-black text-indigo-950">{ipoDetails.listingPrice}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100 text-white">
                                        <p className="text-emerald-100/60 font-bold uppercase tracking-widest text-[10px] mb-1">Total Gain</p>
                                        <p className="text-2xl font-black">{ipoDetails.listingGain}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="card-luxury p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                                    <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                                        <FiActivity className="text-indigo-500" /> Grey Market (GMP)
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-3xl font-black text-emerald-600">{ipoDetails.gmp}</span>
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black">{ipoDetails.gmpPercentage}</span>
                                        </div>
                                        <p className="text-[10px] text-indigo-900/40 font-bold uppercase tracking-widest leading-tight">
                                            Premium over the price band indicates potential listing gains.
                                        </p>
                                    </div>
                                </div>
                                <div className="card-luxury p-8">
                                    <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                                        <FiTarget className="text-rose-500" /> Expected Listing
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-3xl font-black text-indigo-950">{ipoDetails.listingExpected}</p>
                                        <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
                                            <div className="bg-rose-500 h-full rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-indigo-900/40 font-bold uppercase tracking-widest">Calculated based on current GMP</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Scores & Valuation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="card-luxury p-8 bg-gradient-to-br from-indigo-50/50 to-white">
                            <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                                <FiActivity className="text-indigo-500" /> Scores & Valuation
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Piotroski Score</span>
                                    <span className="font-black text-indigo-950">{ipoDetails.scoresAndValuation.piotroskiScore}/9</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Altman Z-Score</span>
                                    <span className="font-black text-indigo-950">{ipoDetails.scoresAndValuation.altmanZScore}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Valuation</span>
                                    <span className="font-black text-emerald-600">{ipoDetails.scoresAndValuation.valuation}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">P/E Ratio</span>
                                    <span className="font-black text-indigo-950">{ipoDetails.scoresAndValuation.peRatio}</span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Mix */}
                        <div className="card-luxury p-8">
                            <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                                <FiPieChart className="text-rose-500" /> Revenue Mix
                            </h2>
                            <div className="space-y-4">
                                {ipoDetails.revenueMix.map((mix: any) => (
                                    <div key={mix.segment} className="flex items-center gap-4">
                                        <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden flex-1">
                                            <div className="bg-rose-500 h-full rounded-full" style={{ width: mix.contribution }}></div>
                                        </div>
                                        <div className="text-right w-32">
                                            <span className="font-black text-indigo-950">{mix.contribution}</span>
                                            <p className="text-[10px] font-bold text-indigo-900/40 uppercase tracking-widest truncate">{mix.segment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quarterly Results */}
                    <div className="card-luxury p-5 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiTrendingUp className="text-emerald-500" /> Quarterly Results
                        </h2>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
                            <table className="w-full text-left border-collapse min-w-max">
                                <thead>
                                    <tr className="bg-indigo-50/50 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4 rounded-l-2xl">Quarter</th>
                                        <th className="p-4">Revenue</th>
                                        <th className="p-4 rounded-r-2xl">Net Profit (PAT)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {ipoDetails.quarterlyResults.map((q: any) => (
                                        <tr key={q.quarter} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="p-4 font-bold text-indigo-950">{q.quarter}</td>
                                            <td className="p-4 font-black text-indigo-900">{q.revenue}</td>
                                            <td className="p-4 font-black text-emerald-600">{q.pat}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile */}
                        <div className="md:hidden space-y-2">
                            {ipoDetails.quarterlyResults.map((q: any) => (
                                <div key={q.quarter} className="bg-indigo-50/30 rounded-xl border border-indigo-100/50 p-3">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">{q.quarter}</p>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Revenue</p>
                                            <p className="text-sm font-black text-indigo-900">{q.revenue}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">PAT</p>
                                            <p className="text-sm font-black text-emerald-600">{q.pat}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profit & Loss */}
                    <div className="card-luxury p-5 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiBarChart2 className="text-amber-500" /> Profit & Loss
                        </h2>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
                            <table className="w-full text-left border-collapse min-w-max">
                                <thead>
                                    <tr className="bg-indigo-50/50 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4 rounded-l-2xl">Year</th>
                                        <th className="p-4">Sales</th>
                                        <th className="p-4">Expenses</th>
                                        <th className="p-4 rounded-r-2xl">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {ipoDetails.profitAndLoss.map((pnl: any) => (
                                        <tr key={pnl.year} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="p-4 font-bold text-indigo-950">{pnl.year}</td>
                                            <td className="p-4 font-black text-indigo-900">{pnl.sales}</td>
                                            <td className="p-4 font-black text-rose-600">{pnl.expenses}</td>
                                            <td className="p-4 font-black text-emerald-600">{pnl.pat}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile */}
                        <div className="md:hidden space-y-2">
                            {ipoDetails.profitAndLoss.map((pnl: any) => (
                                <div key={pnl.year} className="bg-indigo-50/30 rounded-xl border border-indigo-100/50 p-3">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">{pnl.year}</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Sales</p>
                                            <p className="text-sm font-black text-indigo-900">{pnl.sales}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Expenses</p>
                                            <p className="text-sm font-black text-rose-600">{pnl.expenses}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Net Profit</p>
                                            <p className="text-sm font-black text-emerald-600">{pnl.pat}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Balance Sheet */}
                    <div className="card-luxury p-5 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiDatabase className="text-indigo-500" /> Balance Sheet
                        </h2>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
                            <table className="w-full text-left border-collapse min-w-max">
                                <thead>
                                    <tr className="bg-indigo-50/50 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4 rounded-l-2xl">Year</th>
                                        <th className="p-4">Share Capital</th>
                                        <th className="p-4">Reserves</th>
                                        <th className="p-4">Borrowings</th>
                                        <th className="p-4 rounded-r-2xl">Total Assets</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {ipoDetails.balanceSheet.map((bs: any) => (
                                        <tr key={bs.year} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="p-4 font-bold text-indigo-950">{bs.year}</td>
                                            <td className="p-4 font-black text-indigo-900">{bs.shareCapital}</td>
                                            <td className="p-4 font-black text-emerald-600">{bs.reserves}</td>
                                            <td className="p-4 font-black text-rose-600">{bs.borrowings}</td>
                                            <td className="p-4 font-black text-indigo-950">{bs.totalAssets}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile */}
                        <div className="md:hidden space-y-2">
                            {ipoDetails.balanceSheet.map((bs: any) => (
                                <div key={bs.year} className="bg-indigo-50/30 rounded-xl border border-indigo-100/50 p-3">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">{bs.year}</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Share Capital</p>
                                            <p className="text-sm font-black text-indigo-900">{bs.shareCapital}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Reserves</p>
                                            <p className="text-sm font-black text-emerald-600">{bs.reserves}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Borrowings</p>
                                            <p className="text-sm font-black text-rose-600">{bs.borrowings}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Total Assets</p>
                                            <p className="text-sm font-black text-indigo-950">{bs.totalAssets}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Peer Comparison */}
                    <div className="card-luxury p-5 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiGlobe className="text-indigo-500" /> Peer Comparison
                        </h2>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
                            <table className="w-full text-left border-collapse min-w-max">
                                <thead>
                                    <tr className="bg-indigo-50/50 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4 rounded-l-2xl">Company</th>
                                        <th className="p-4">P/E</th>
                                        <th className="p-4">ROE</th>
                                        <th className="p-4 rounded-r-2xl">Market Cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {ipoDetails.peerComparison.map((peer: any, idx: number) => (
                                        <tr key={peer.company} className={`transition-colors ${idx === 0 ? 'bg-indigo-50/30' : 'hover:bg-indigo-50/20'}`}>
                                            <td className="p-4 font-bold text-indigo-950 flex items-center gap-2">
                                                {idx === 0 && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                                                {peer.company}
                                            </td>
                                            <td className="p-4 font-black text-indigo-900">{peer.pe}</td>
                                            <td className="p-4 font-black text-emerald-600">{peer.roe}</td>
                                            <td className="p-4 font-black text-indigo-950">{peer.mcap}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile */}
                        <div className="md:hidden space-y-2">
                            {ipoDetails.peerComparison.map((peer: any, idx: number) => (
                                <div key={peer.company} className={`rounded-xl border overflow-hidden ${idx === 0 ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-indigo-100/50'}`}>
                                    <div className={`px-4 py-2.5 flex items-center gap-2 ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-indigo-50/40'}`}>
                                        {idx === 0 && <span className="w-2 h-2 rounded-full bg-white"></span>}
                                        <span className={`text-sm font-black ${idx === 0 ? 'text-white' : 'text-indigo-950'}`}>{peer.company}</span>
                                    </div>
                                    <div className="grid grid-cols-3 divide-x divide-indigo-50/50 bg-white">
                                        <div className="px-3 py-2.5 text-center">
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">P/E</p>
                                            <p className="text-sm font-black text-indigo-900">{peer.pe}</p>
                                        </div>
                                        <div className="px-3 py-2.5 text-center">
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">ROE</p>
                                            <p className="text-sm font-black text-emerald-600">{peer.roe}</p>
                                        </div>
                                        <div className="px-3 py-2.5 text-center">
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">Mkt Cap</p>
                                            <p className="text-sm font-black text-indigo-950">{peer.mcap}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - Secondary Details */}
                <div className="space-y-8">
                    {/* Key Issue Details */}
                    <div className="card-luxury p-8 border-t-4 border-t-emerald-500">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiDollarSign className="text-emerald-500" /> IPO Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Issue Size</span>
                                <span className="font-black text-indigo-950">{ipoDetails.issueSize}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Lot Size</span>
                                <span className="font-black text-indigo-950">{ipoDetails.lotSize}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Expected Listing</span>
                                <span className="font-black text-indigo-950">{ipoDetails.listingDate}</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all duration-300 uppercase tracking-widest text-xs shadow-lg shadow-indigo-200">
                            Apply for IPO
                        </button>
                    </div>

                    {/* Investment Views */}
                    <div className="card-luxury p-8">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-500" /> Investment Views
                        </h2>
                        <div className="space-y-6">
                            {ipoDetails.investmentViews.map((view: any, idx: number) => (
                                <div key={idx} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-black text-indigo-950 text-sm">{view.brokerage}</span>
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                            {view.view}
                                        </span>
                                    </div>
                                    <p className="text-xs text-indigo-950/60 font-medium">{view.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cash Flows */}
                    <div className="card-luxury p-8">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiActivity className="text-rose-500" /> Cash Flows (FY23)
                        </h2>
                         <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Operating</span>
                                <span className="font-black text-emerald-600">{ipoDetails.cashFlows.operating}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Investing</span>
                                <span className="font-black text-rose-600">{ipoDetails.cashFlows.investing}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-indigo-50">
                                <span className="text-indigo-900/50 font-bold uppercase tracking-widest text-[10px]">Financing</span>
                                <span className="font-black text-rose-600">{ipoDetails.cashFlows.financing}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-indigo-900/50 font-black uppercase tracking-widest text-[10px]">Net Cash Flow</span>
                                <span className="font-black text-indigo-950">{ipoDetails.cashFlows.net}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shareholding Pattern */}
                    <div className="card-luxury p-8">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiUsers className="text-amber-500" /> Shareholding Change
                        </h2>
                        <div className="space-y-4">
                            {ipoDetails.shareholdingPattern.map((pattern: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-indigo-50 last:border-0">
                                    <span className="text-indigo-900/70 font-bold text-sm">{pattern.category}</span>
                                    <div className="text-right">
                                        <span className="text-[10px] text-rose-500 font-bold line-through mr-2">{pattern.preIssue}</span>
                                        <span className="font-black text-emerald-600">{pattern.postIssue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Suppliers */}
                    <div className="card-luxury p-8">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiBriefcase className="text-indigo-500" /> Key Suppliers & Partners
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {ipoDetails.keySuppliers.map((supplier: any, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                                    {supplier}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Investor Documents */}
                    <div className="card-luxury p-8 border-b-4 border-b-indigo-500">
                        <h2 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2">
                            <FiFileText className="text-indigo-500" /> Investor Documents
                        </h2>
                        <div className="space-y-3">
                            {ipoDetails.investorDocuments.map((doc: any, idx: number) => (
                                <button key={idx} className="w-full flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <p className="font-bold text-indigo-900 text-sm group-hover:text-indigo-600 transition-colors">{doc.title}</p>
                                        <p className="text-[10px] text-indigo-900/40 uppercase tracking-widest font-bold mt-1">PDF • {doc.date}</p>
                                    </div>
                                    <FiArrowLeft className="rotate-180 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            </>
        )}
        </PageShell>
    );
};

export default IPODetails;
