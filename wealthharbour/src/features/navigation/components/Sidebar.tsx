import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiTrendingUp,
    FiBriefcase,
    FiPieChart,
    FiDatabase,
    FiLayers,
    FiActivity,
    FiX,
    FiBell,
    FiBarChart2,
    FiCheckCircle,
    FiFlag,
    FiShield,
    FiZap,
} from 'react-icons/fi';
import { NAV_ITEMS } from '../../../constants/navigation';
import { useAppSelector } from '../../../store/hooks';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { topAssets } = useAppSelector((state) => state.preferences);

    const getOrderedNavItems = () => {
        let baseItems = NAV_ITEMS;
        
        if (topAssets && topAssets.length > 0) {
            const top3 = topAssets.slice(0, 3);
            const topItems = NAV_ITEMS.filter(item => top3.includes(item.name));
            const otherItems = NAV_ITEMS.filter(item => !top3.includes(item.name));
            baseItems = [...topItems, ...otherItems];
        }
        
        // Ensure 'Indian Forecast' is always last if it exists in the list
        const forecastItem = baseItems.find(item => item.name === 'Indian Forecast');
        if (forecastItem) {
            const filteredItems = baseItems.filter(item => item.name !== 'Indian Forecast');
            return [...filteredItems, forecastItem];
        }
        
        return baseItems;
    };

    const orderedNavItems = getOrderedNavItems();
    const getIcon = (name: string) => {
        switch (name) {
            case 'Home': return <FiLayers />;
            case 'Dashboard': return <FiZap />;
            case 'Stocks': return <FiTrendingUp />;
            case 'Indices': return <FiActivity />;
            case 'IPO': return <FiLayers />;
            case 'Mutual Fund': return <FiBriefcase />;
            case 'ETF': return <FiPieChart />;
            case 'F&O Options': return <FiLayers />;
            case 'Securities Bond': return <FiShield />;
            case 'Currency Derivatives': return <FiActivity />;
            case 'Gold & Silver': return <FiLayers />;
            case 'Commodities': return <FiDatabase />;
            case 'FII & DII Data': return <FiBarChart2 />;
            case 'REITS': return <FiPieChart />;
            case 'Intraday Stocks': return <FiTrendingUp />;
            case 'Indian Forecast': return <FiFlag />;
            case 'Suggestion': return <FiCheckCircle />;
            case 'Results Calendar': return <FiLayers />;
            case 'Notifications': return <FiBell />;
            case 'Stocks in News': return <FiActivity />;
            default: return <FiLayers />;
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed top-[90px] inset-x-0 bottom-0 bg-indigo-900/20 backdrop-blur-sm z-[60] md:hidden transition-opacity cursor-pointer"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-[90px] bottom-0 left-0 w-[85vw] max-w-64 bg-white/95 backdrop-blur-xl flex flex-col border-r border-indigo-100 z-[70] transition-transform duration-500 ease-in-out md:relative md:top-0 md:w-64 md:max-w-none md:translate-x-0 md:bg-white/80 md:h-full
                ${isOpen ? 'translate-x-0 shadow-2xl shadow-indigo-900/10' : '-translate-x-full md:flex-shrink-0'}
            `}>
                <div className="p-6 border-b border-indigo-50 flex items-center justify-end shrink-0 md:hidden">
                    <button
                        onClick={onClose}
                        className="p-2 md:hidden text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                        aria-label="Close menu"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-premium p-4 md:p-6 space-y-1.5 custom-scrollbar">
                        <div className="space-y-1 pb-12">
                            {orderedNavItems.map((item, idx) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.path === '/'}
                                    onClick={() => {
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-[1.25rem] transition-all duration-300 group ${isActive
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 translate-x-1'
                                            : 'text-indigo-950/60 hover:bg-indigo-50 hover:text-indigo-950 hover:translate-x-1'
                                        }`
                                    }
                                    style={{ transitionDelay: `${idx * 20}ms` }}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-600'}`}>
                                                {getIcon(item.name)}
                                            </span>
                                            <span className="tracking-tight">{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                            {/* Extra spacer for scroll room */}
                            <div className="h-20 md:hidden" />
                        </div>
                        {/* Buffer removed to fix extra space */}
                    </div>
                    
                    {/* Bottom gradient mask for soft scroll look */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none hidden md:block" />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
