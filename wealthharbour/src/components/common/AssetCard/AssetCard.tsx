import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatNumberEnIn } from '../../../utils/numberFormat';
import { useAppSelector } from '../../../store/hooks';
import { addToWatchlist, removeFromWatchlist } from '../../../utils/watchlistUtils';
import styles from './AssetCard.module.css';

interface AssetCardProps {
    id?: string;
    symbol?: string;
    name: string;
    subtitle?: string;
    price: string | number;
    change: string | number;
    changePercent?: boolean;
    isPositive: boolean;
    tags: string[];
    detailsRoute: string;
    analyzeLabel?: string;
    Icon: React.ElementType;
    metrics?: { label: string; value: string | number }[];
    watchlistItem?: {
        item_id: string;
        item_name: string;
        symbol: string;
        item_type: 'stock' | 'mutual-fund' | 'etf' | 'commodity' | 'index';
    };
}

const AssetCard: React.FC<AssetCardProps> = ({
    symbol,
    name,
    subtitle,
    price,
    change,
    changePercent,
    isPositive,
    tags,
    detailsRoute,
    analyzeLabel = "Analyze Details",
    Icon,
    metrics,
    watchlistItem
}) => {
    const watchlist = useAppSelector(state => state.auth.watchlist);
    const inWatchlist = watchlistItem ? watchlist.some(w => w.item_id === watchlistItem.item_id) : false;

    const handleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!watchlistItem) return;
        const priceNum = typeof price === 'number' ? price : parseFloat(String(price).replace(/,/g, ''));
        const changeNum = typeof change === 'number' ? change : parseFloat(String(change).replace(/[^0-9.-]+/g, ''));
        if (inWatchlist) {
            removeFromWatchlist(watchlistItem.item_id, watchlistItem.item_name, watchlistItem.symbol);
        } else {
            addToWatchlist({
                item_id: watchlistItem.item_id,
                item_name: watchlistItem.item_name,
                symbol: watchlistItem.symbol,
                item_type: watchlistItem.item_type,
                price: isNaN(priceNum) ? undefined : priceNum,
                change: isNaN(changeNum) ? undefined : changeNum,
            });
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.bgIcon}>
                <Icon className="text-8xl text-indigo-950" />
            </div>

            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                        {symbol && (
                            <span className={styles.symbolBadge}>
                                {symbol}
                            </span>
                        )}
                        <h3 className={styles.title}>
                            {name}
                        </h3>
                        {subtitle && (
                            <p className={styles.subtitle}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`flex flex-col items-end shrink-0 ${isPositive ? styles.positive : styles.negative}`}>
                        <span className={styles.price}>
                            ₹{typeof price === 'number' ? formatNumberEnIn(price) : price}
                        </span>
                        <div className={styles.changeContainer}>
                            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>
                                {isPositive && !String(change).startsWith('+') ? '+' : ''}
                                {typeof change === 'number' ? formatNumberEnIn(change) : change}
                                {changePercent && !String(change).endsWith('%') ? '%' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.tagsContainer}>
                    {tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                {metrics && metrics.length > 0 && (
                    <div className={styles.metricsGrid} style={{ gridTemplateColumns: `repeat(${metrics.length}, 1fr)` }}>
                        {metrics.map((m, idx) => (
                            <div key={idx}>
                                <p className={styles.metricLabel}>{m.label}</p>
                                <p className={styles.metricValue}>{m.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4">
                <Link
                    to={detailsRoute}
                    className={styles.actionLink}
                >
                    {analyzeLabel}
                </Link>
                {watchlistItem && (
                    <button
                        onClick={handleWatchlist}
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 ${inWatchlist ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                        title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                        <FiStar className={inWatchlist ? 'fill-current' : ''} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssetCard;
