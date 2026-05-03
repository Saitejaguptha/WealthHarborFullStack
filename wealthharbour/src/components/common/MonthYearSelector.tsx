import React from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

interface MonthYearSelectorProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    className?: string;
    /** Compact row for header / tight toolbars */
    size?: 'default' | 'compact';
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    className = '',
    size = 'default',
}) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const isCompact = size === 'compact';

    const shellClass = isCompact
        ? 'flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-md p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-indigo-100 shadow-sm'
        : 'flex items-center gap-1 md:gap-2 bg-white/70 backdrop-blur-md p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-white shadow-lg shadow-indigo-100/50';

    const selectShell = 'relative flex items-center shrink-0';
    const selectClass = isCompact
        ? 'bg-white border border-indigo-100 text-[9px] sm:text-[10px] font-bold text-indigo-900 rounded-md sm:rounded-lg pl-2 pr-6 sm:pl-2.5 sm:pr-7 py-1 sm:py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none shadow-sm hover:shadow-md transition-all uppercase tracking-wide max-w-[4.25rem] sm:max-w-none'
        : 'bg-white border border-indigo-50 text-[10px] md:text-sm font-bold text-indigo-900 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2 pr-8 md:pr-10 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none shadow-sm hover:shadow-md transition-all uppercase tracking-wider';

    const chevronClass = isCompact
        ? 'absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 w-3 h-3'
        : 'absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 w-3.5 h-3.5 md:w-4 md:h-4';

    return (
        <div className={`${shellClass} ${className}`.trim()}>
            <div className={`${isCompact ? 'hidden sm:flex' : 'hidden sm:flex'} items-center gap-2 px-1 md:px-3 text-indigo-400 shrink-0`}>
                <FiCalendar className={isCompact ? 'w-3 h-3' : 'w-3 h-3 md:w-4 md:h-4'} />
            </div>

            <div className={selectShell}>
                <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                    className={selectClass}
                    aria-label="Select month"
                >
                    {months.map((month, index) => (
                        <option key={month} value={index}>
                            {month.substring(0, 3)}
                        </option>
                    ))}
                </select>
                <FiChevronDown className={chevronClass} aria-hidden />
            </div>

            <div className={selectShell}>
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className={selectClass}
                    aria-label="Select year"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <FiChevronDown className={chevronClass} aria-hidden />
            </div>
        </div>
    );
};

export default MonthYearSelector;
