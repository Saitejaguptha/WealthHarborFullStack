import React from 'react';
import { FiSearch, FiLayers } from 'react-icons/fi';
import styles from './FilterBar.module.css';

export interface FilterOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
    options: string[];
}

interface FilterBarProps {
    title?: string;
    description?: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters: FilterOption[];
    onFilterChange: (label: string, value: string) => void;
    currentFilters: Record<string, string>;
    onRefresh?: () => void;
    refreshLabel?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    filters,
    onFilterChange,
    currentFilters,
}) => {
    return (
        <div className={styles.wrapper}>
            {/* Search Bar */}
            <div className={styles.searchWrapper}>
                <FiSearch className={styles.searchIcon} aria-hidden="true" />
                <input
                    type="search"
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Filters */}
            <div className={styles.filtersRow}>
                {filters.map((filter) => (
                    <div key={filter.label} className={styles.filterItem}>
                        <span className={styles.filterIcon} aria-hidden="true">
                            {filter.icon || <FiLayers />}
                        </span>
                        <select
                            aria-label={`Filter by ${filter.label}`}
                            className={styles.filterSelect}
                            value={currentFilters[filter.label] || 'All'}
                            onChange={(e) => onFilterChange(filter.label, e.target.value)}
                        >
                            <option value="All">{filter.label}: All</option>
                            {filter.options.filter(opt => opt !== 'All').map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className={styles.chevron} aria-hidden="true">▼</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
