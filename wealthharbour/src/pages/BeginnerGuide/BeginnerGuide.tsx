import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiBookOpen, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiActivity, FiLayers, FiBriefcase, FiPieChart, FiShield, FiDatabase, FiBarChart2, FiFlag } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import styles from './BeginnerGuide.module.css';

interface AssetGuide {
    id: string;
    name: string;
    icon: React.ReactNode;
    definition: string;
    profitLogic: string;
    risks: string;
}

const guides: AssetGuide[] = [
    {
        id: 'stocks',
        name: 'Stocks',
        icon: <FiTrendingUp />,
        definition: "Buying a piece of ownership in a company.",
        profitLogic: "Dividend payouts and capital appreciation (stock price going up).",
        risks: "Market volatility, company performance, and economic shifts."
    },
    {
        id: 'mutual-funds',
        name: 'Mutual Fund',
        icon: <FiBriefcase />,
        definition: "A pool of money from many investors used to buy a diversified portfolio of stocks/bonds.",
        profitLogic: "Professional management aims for steady growth or income distributions.",
        risks: "Expense ratios, manager risk, and underlying asset market risk."
    },
    {
        id: 'ipo',
        name: 'IPO',
        icon: <FiLayers />,
        definition: "Initial Public Offering - when a private company goes public for the first time.",
        profitLogic: "Potential for high 'listing gains' if demand exceeds supply on debut.",
        risks: "Uncertain track record, high hype, and potential for post-listing crash."
    },
    {
        id: 'indices',
        name: 'Indices',
        icon: <FiActivity />,
        definition: "A statistical measure of the performance of a specific group of stocks (e.g., Nifty 50).",
        profitLogic: "Exposure to the overall economy or sector growth without picking single stocks.",
        risks: "Systemic risk - if the whole market falls, the index falls."
    },
    {
        id: 'intraday',
        name: 'Intraday',
        icon: <FiTrendingUp />,
        definition: "Buying and selling stocks within the same trading day.",
        profitLogic: "Profiting from small price movements during the day using leverage.",
        risks: "Extremely high risk, requires constant monitoring, and psychological stress."
    },
    {
        id: 'f-and-o',
        name: 'F&O (Futures & Options)',
        icon: <FiLayers />,
        definition: "Derivative contracts that derive value from an underlying asset.",
        profitLogic: "Hedging or speculating on future price movements with high leverage.",
        risks: "Unlimited loss potential, complex mechanics, and time decay (Theta)."
    },
    {
        id: 'currency',
        name: 'Currency',
        icon: <FiActivity />,
        definition: "Trading currency pairs (e.g., USD-INR) in the forex market.",
        profitLogic: "Gains from exchange rate fluctuations driven by global macro events.",
        risks: "Geopolitical instability, interest rate changes, and 24/5 market hours."
    },
    {
        id: 'commodities',
        name: 'Commodities',
        icon: <FiDatabase />,
        definition: "Trading physical goods like Oil, Natural Gas, or Agricultural products.",
        profitLogic: "Profit from supply-demand imbalances and global inflation.",
        risks: "Storage costs, weather events, and global supply chain disruptions."
    },
    {
        id: 'gold-silver',
        name: 'Gold & Silver',
        icon: <FiLayers />,
        definition: "Investing in precious metals as a 'Safe Haven' asset.",
        profitLogic: "Wealth preservation and price appreciation during economic uncertainty.",
        risks: "Price drops during strong economic growth and storage/purity issues."
    },
    {
        id: 'bonds',
        name: 'Bonds',
        icon: <FiShield />,
        definition: "Lending money to a government or corporation for a fixed interest rate.",
        profitLogic: "Regular interest payments (Coupons) and return of principal at maturity.",
        risks: "Interest rate risk (prices fall when rates rise) and credit/default risk."
    },
    {
        id: 'reits',
        name: 'REITs',
        icon: <FiPieChart />,
        definition: "Real Estate Investment Trusts - companies that own/operate income-producing real estate.",
        profitLogic: "Rental income distributed as dividends and property value growth.",
        risks: "Real estate market cycles, occupancy rates, and interest rate sensitivity."
    },
    {
        id: 'fii-dii',
        name: 'FII/DII',
        icon: <FiBarChart2 />,
        definition: "Foreign & Domestic Institutional Investors - big players like pension funds/mutual funds.",
        profitLogic: "Tracking their 'Big Money' movements to identify market trends.",
        risks: "Institutions can exit quickly, causing sharp market corrections."
    },
    {
        id: 'forecast',
        name: 'Indian Forecast',
        icon: <FiFlag />,
        definition: "Analyzing macroeconomic indicators (GDP, Inflation, RBI rates) for future outlook.",
        profitLogic: "Positioning investments based on long-term structural growth of India.",
        risks: "Policy changes, global headwinds, and data misinterpretation."
    }
];

const BeginnerGuide: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>('stocks');

    return (
        <PageShell className="pb-32">
            <PageHeader 
                title="Investment 101"
                subtitle="Master the fundamentals of every asset class with our architectural guide."
                icon={<FiBookOpen className="text-indigo-600" />}
            />

            <div className={styles.container}>
                <div className={styles.accordion}>
                    {guides.map((guide) => {
                        const isOpen = openId === guide.id;
                        return (
                            <div key={guide.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                                <button 
                                    className={styles.header}
                                    onClick={() => setOpenId(isOpen ? null : guide.id)}
                                >
                                    <div className={styles.titleGroup}>
                                        <span className={styles.icon}>{guide.icon}</span>
                                        <h3 className={styles.title}>{guide.name}</h3>
                                    </div>
                                    <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className={styles.content}>
                                                <div className={styles.section}>
                                                    <span className={styles.sectionTitle}>Definition</span>
                                                    <p className={styles.sectionText}>{guide.definition}</p>
                                                </div>
                                                <div className={styles.section}>
                                                    <span className={styles.sectionTitle}>Profit Logic</span>
                                                    <p className={styles.sectionText}>{guide.profitLogic}</p>
                                                </div>
                                                <div className={styles.section}>
                                                    <span className={styles.sectionTitle}>Key Risks</span>
                                                    <p className={styles.sectionText}>{guide.risks}</p>
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
        </PageShell>
    );
};

export default BeginnerGuide;
