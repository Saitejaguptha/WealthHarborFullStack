import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiTrash2, FiArrowRight, FiBookmark, FiActivity, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../features/auth/authHooks';
import { formatNumberEnIn } from '../../utils/numberFormat';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWatchlistAsync, removeFromWatchlistAsync, createNotificationAsync, type WatchlistItem } from '../../features/auth/authSlice';
import { GuideService } from '../../services/api';

const Watchlist: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    const [guide, setGuide] = useState<any>(null);

    useEffect(() => {
        if (user?.user_uuid) {
            dispatch(fetchWatchlistAsync(user.user_uuid));
        }
        const loadGuide = async () => {
            const data = await GuideService.getGuide('watchlist');
            if (data) setGuide(data);
        };
        loadGuide();
    }, [user?.user_uuid]);

    const handleRemove = (e: React.MouseEvent, item_id: string, item_name: string, symbol: string) => {
        e.stopPropagation();
        if (!user?.user_uuid) return;
        dispatch(removeFromWatchlistAsync({ user_uuid: user.user_uuid, item_id }));
        dispatch(createNotificationAsync({
            user_uuid: user.user_uuid,
            description: `Removed ${item_name} (${symbol}) from your watchlist`
        }));
        toast.success(`Removed ${item_name} from watchlist`);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'stock': return 'bg-indigo-600';
            case 'mutual-fund': return 'bg-emerald-600';
            case 'etf': return 'bg-amber-600';
            case 'commodity': return 'bg-rose-600';
            case 'index': return 'bg-violet-600';
            default: return 'bg-slate-600';
        }
    };

    const getNavigationPath = (item: WatchlistItem) => {
        switch (item.item_type) {
            case 'stock': return `/stocks/${item.symbol}`;
            case 'mutual-fund': return `/mutual-funds/${item.item_id}`;
            case 'etf': return `/etfs/${item.item_id}`;
            case 'commodity': return `/commodities/${item.item_id}`;
            case 'index': return `/index-details/${encodeURIComponent(item.item_id)}`;
            default: return '/';
        }
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="My Watchlist"
                subtitle="Curate and track your high-conviction market positions."
                icon={<FiBookmark className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {watchlist.length === 0 ? (
                <div className="mt-12 py-32 text-center bg-indigo-50/50 rounded-[4rem] border border-dashed border-indigo-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-200 mx-auto mb-8 shadow-inner">
                        <FiBookmark size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Registry Empty</h2>
                    <p className="text-indigo-900/40 font-medium max-w-sm mx-auto mt-4 leading-relaxed">
                        Your high-conviction registry is currently inactive. Start identifying opportunities to build your core list.
                    </p>
                    <button
                        onClick={() => navigate('/stocks')}
                        className="mt-10 px-10 py-5 bg-indigo-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-4 mx-auto group"
                    >
                        Explore Active Markets <FiSearch className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 stagger-children">
                    {watchlist.map((item: WatchlistItem) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(getNavigationPath(item))}
                            className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute -right-8 -top-8 text-indigo-50/20 group-hover:text-indigo-600/5 transition-colors duration-500 pointer-events-none">
                                <FiActivity size={180} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="mb-12">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-3">
                                            <span className={`px-4 py-1.5 ${getTypeColor(item.item_type)} text-white rounded-xl text-[9px] font-black uppercase tracking-widest self-start shadow-sm`}>
                                                {item.item_type.replace('-', ' ')}
                                            </span>
                                            <h3 className="text-2xl font-black text-indigo-950 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{item.item_name}</h3>
                                            <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.2em]">{item.symbol}</p>
                                        </div>
                                        <button
                                            onClick={(e) => handleRemove(e, item.item_id, item.item_name, item.symbol)}
                                            className="p-4 bg-indigo-50 text-indigo-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-inner"
                                            title="Remove from Watchlist"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-end justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-indigo-900/20 uppercase tracking-widest leading-none">Current Value</p>
                                            <span className="text-3xl font-black text-indigo-950 tracking-tighter leading-none font-mono">
                                                {typeof item.price === 'number' ? `₹${formatNumberEnIn(item.price)}` : (item.price ?? '—')}
                                            </span>
                                        </div>
                                        {item.change_pct !== undefined && item.change_pct !== null && (
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${item.change_pct >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {item.change_pct >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                                                {formatNumberEnIn(Math.abs(item.change_pct))}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] hover:gap-5 transition-all">
                                        Full Structural Analysis <FiArrowRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageShell>
    );
};

export default Watchlist;

