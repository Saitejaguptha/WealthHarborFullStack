// Shared mock data for advanced insights across Mutual Funds, ETFs, and Indices

export const mockMonthlyData = [
    {
        id: 0,
        monthName: 'April 2024',
        constituents: [
            { name: 'HDFC Bank', weight: '13.52%', sector: 'Financial Services' },
            { name: 'ICICI Bank', weight: '8.21%', sector: 'Financial Services' },
            { name: 'Reliance Industries', weight: '9.85%', sector: 'Energy' },
            { name: 'Infosys', weight: '6.45%', sector: 'IT' },
            { name: 'TCS', weight: '4.10%', sector: 'IT' },
            { name: 'ITC Ltd', weight: '5.10%', sector: 'FMCG' },
            { name: 'Larsen & Toubro', weight: '4.85%', sector: 'Construction' },
        ],
        changes: {
            added: ['Jio Financial Services', 'Zomato Ltd'],
            removed: ['UPL Ltd', 'Wipro (Weight reduction to 0)'],
            increased: ['Tata Motors', 'NTPC', 'Coal India'],
            decreased: ['HDFC Bank', 'Infosys', 'Asian Paints']
        }
    },
    {
        id: 1,
        monthName: 'March 2024',
        constituents: [
            { name: 'HDFC Bank', weight: '14.10%', sector: 'Financial Services' },
            { name: 'ICICI Bank', weight: '8.05%', sector: 'Financial Services' },
        ],
        changes: { added: ['Shriram Finance'], removed: [], increased: ['SBI', 'L&T'], decreased: ['TCS'] }
    }
];

export const comprehensiveDetails = {
    portfolioOverview: {
        assetAllocation: [
            { label: 'Equity', value: '81.06%', color: 'bg-emerald-500' },
            { label: 'Debt', value: '1.74%', color: 'bg-indigo-400' },
            { label: 'Cash', value: '17.20%', color: 'bg-rose-400' },
            { label: 'Derivatives', value: '0.00%', color: 'bg-amber-400' }
        ],
        weightage: [
            { label: 'Largecap', value: '62.52%' },
            { label: 'Midcap', value: '1.92%' },
            { label: 'Smallcap', value: '2.76%' },
            { label: 'Others', value: '32.8%' }
        ],
        concentration: {
            noOfStocks: '125', avgMarketCap: '₹5,28,736.00 Cr', top10: '49.82%', top5: '31.26%', top3Sectors: '44.61%'
        }
    },
    fundamentals: [
        { measure: 'PE', fund: '17.94', avg: '22.48' },
        { measure: 'PB', fund: '2.77', avg: '3.31' },
        { measure: 'Price/Sale', fund: '3.83', avg: '2.87' },
        { measure: 'Price/Cash Flow', fund: '13.72', avg: '16.39' },
        { measure: 'Dividend Yield', fund: '2.34%', avg: '1.34%' },
        { measure: 'Sales Growth', fund: '12.4%', avg: '9.8%' }
    ],
    riskMetrics: [
        { measure: 'Standard Deviation', value: '14.2%', avg: '15.5%' },
        { measure: 'Beta', value: '0.92', avg: '1.0' },
        { measure: 'Sharpe Ratio', value: '0.85', avg: '0.70' }
    ],
    peers: [
        { name: 'NIFTY 50 ETF', return1Y: '24.5%', aum: '₹12,000 Cr' },
        { name: 'SENSEX ETF', return1Y: '22.1%', aum: '₹8,500 Cr' }
    ],
    outlook: {
        shortTerm: 'Neutral', midTerm: 'Accumulate Phase', longTerm: 'Highly Preferred',
        holdAnalysis: [
            { cap: 'Large Cap', stance: 'Core Portfolio Hold', rating: 'Overweight', color: 'emerald' },
            { cap: 'Mid Cap', stance: 'Trim/Reduce Exposure', rating: 'Underweight', color: 'rose' },
            { cap: 'Small Cap', stance: 'Buy the Dips', rating: 'Neutral', color: 'amber' },
        ]
    }
};
