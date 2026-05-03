
export const getMarketOverview = () => {
    return {
        sentiment: 'Cautiously Bullish',
        sentimentDetail: 'Driven by tech sector earnings and steady interest rates.',
        vix: {
            value: 15.45,
            change: -0.85,
            changePct: -5.21
        },
        topSector: {
            name: 'Technology',
            growth: '+2.4%'
        },
        movers: [
            { symbol: 'RELIANCE', company: 'Reliance Industries', price: '₹2,985.40', change: '+1.2%', isPositive: true, volume: '4.5M' },
            { symbol: 'HDFCBANK', company: 'HDFC Bank Ltd', price: '₹1,442.20', change: '-0.8%', isPositive: false, volume: '18.2M' },
            { symbol: 'TCS', company: 'Tata Consultancy', price: '₹4,120.15', change: '+2.4%', isPositive: true, volume: '2.1M' },
            { symbol: 'ICICIBANK', company: 'ICICI Bank Ltd', price: '₹1,085.60', change: '+1.5%', isPositive: true, volume: '12.4M' },
            { symbol: 'INFY', company: 'Infosys Ltd', price: '₹1,620.35', change: '-1.1%', isPositive: false, volume: '6.8M' }
        ]
    };
};

export const getMarketSummary = () => {
    return {
        highlights: [
            "Nifty 50 reclaimed the 22,000 mark led by IT and Banking sectors.",
            "Foreign Institutional Investors (FIIs) turned net buyers after 3 sessions.",
            "Reliance Industries hit a fresh 52-week high after positive sales data.",
            "Gold prices remain stable near record highs amid global uncertainty.",
            "Midcap indices outperformed the benchmarks with 1.5% gains."
        ],
        videoUrl: "https://example.com/video-overview",
        audioUrl: "https://example.com/audio-brief"
    };
};
