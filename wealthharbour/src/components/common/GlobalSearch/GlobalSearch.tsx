import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiActivity, FiBriefcase, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { StockService, MutualFundService, IndexService, ETFService } from '../../../services/api';
import styles from './GlobalSearch.module.css';

interface SearchResult {
    id: string;
    name: string;
    subtitle: string;
    price?: string | number;
    change?: string | number;
    isPositive?: boolean;
    type: 'Stock' | 'Mutual Fund' | 'ETF' | 'Index';
    route: string;
}

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const [stocksData, mfsData, indicesData, etfsData] = await Promise.all([
                    StockService.getStocks({ search: query }).catch(() => ({ stocks: [] })),
                    MutualFundService.getMutualFunds().catch(() => ({ funds: [] })),
                    IndexService.getAllIndices({ search: query }).catch(() => ({ indices: [] })),
                    ETFService.getETFs().catch(() => ({ etfs: [] }))
                ]);
                
                const stocks = (stocksData as any).stocks || [];
                const mfs = (mfsData as any).funds || [];
                const indices = (indicesData as any).indices || [];
                const etfs = (etfsData as any).etfs || [];

                const formattedResults: SearchResult[] = [
                    ...stocks.slice(0, 3).map((s: any) => ({
                        id: s.symbol,
                        name: s.name,
                        subtitle: s.symbol,
                        price: s.price,
                        change: s.changePercent,
                        isPositive: s.changePercent >= 0,
                        type: 'Stock' as const,
                        route: `/stocks/${s.symbol}`
                    })),
                    ...mfs.filter((m: any) => m.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map((m: any) => ({
                        id: m.id,
                        name: m.name,
                        subtitle: m.fundHouse,
                        price: m.nav,
                        change: m.return1Y,
                        isPositive: (m.return1Y || 0) >= 0,
                        type: 'Mutual Fund' as const,
                        route: `/mutual-funds/${m.id}`
                    })),
                    ...indices.slice(0, 3).map((idx: any) => ({
                        id: idx.name,
                        name: idx.name,
                        subtitle: idx.exchange,
                        price: idx.value,
                        change: idx.change,
                        isPositive: idx.isPositive,
                        type: 'Index' as const,
                        route: `/index-details/${encodeURIComponent(idx.name)}`
                    })),
                    ...etfs.filter((e: any) => e.name.toLowerCase().includes(query.toLowerCase()) || e.symbol.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map((e: any) => ({
                        id: e.id,
                        name: e.name,
                        subtitle: e.symbol,
                        price: e.price,
                        change: e.changePercent,
                        isPositive: (e.change || 0) >= 0,
                        type: 'ETF' as const,
                        route: `/etfs/${e.id}`
                    }))
                ];

                setResults(formattedResults);
                setIsOpen(true);
            } catch (err) {
                console.error('Global Search Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = () => {
        setQuery('');
        setIsOpen(false);
    };

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.type]) acc[result.type] = [];
        acc[result.type].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    const getIcon = (type: string) => {
        switch (type) {
            case 'Stock': return <FiTrendingUp />;
            case 'Mutual Fund': return <FiActivity />;
            case 'ETF': return <FiBriefcase />;
            case 'Index': return <FiPieChart />;
            default: return <FiSearch />;
        }
    };

    return (
        <div className={styles.searchContainer} ref={containerRef}>
            <div className={styles.searchWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search stocks, mutual funds, indices..."
                    className={styles.searchInput}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <div className={styles.resultsDropdown}>
                    {isLoading && (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                        </div>
                    )}

                    {!isLoading && results.length === 0 && query.length >= 2 && (
                        <div className={styles.noResults}>No matches found for "{query}"</div>
                    )}

                    {!isLoading && Object.entries(groupedResults).map(([type, items]) => (
                        <div key={type} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                {getIcon(type)}
                                {type}s
                            </div>
                            {items.map((item) => (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    to={item.route}
                                    className={styles.resultItem}
                                    onClick={handleSelect}
                                >
                                    <div className={styles.itemMain}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemSub}>{item.subtitle}</span>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        <span className={styles.priceValue}>
                                            {typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}
                                        </span>
                                        <span className={`${styles.priceChange} ${item.isPositive ? styles.positive : styles.negative}`}>
                                            {item.isPositive ? '+' : ''}{item.change}{typeof item.change === 'number' ? '%' : ''}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
