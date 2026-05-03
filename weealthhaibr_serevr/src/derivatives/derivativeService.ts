

export const getOptionChain = () => {
    return [
        { 
            strike: 22000, 
            callPrice: 450.50, callChange: 12.5, callOI: '45.2k', callOIChange: '+1.2k', callIV: '12.4%', 
            callDelta: 0.95, callTheta: -2.1, callGamma: 0.0002, callVega: 1.5,
            putPrice: 12.20, putChange: -5.4, putOI: '12.8k', putOIChange: '-0.5k', putIV: '18.2%', 
            putDelta: -0.05, putTheta: -1.2, putGamma: 0.0001, putVega: 0.8,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22100, 
            callPrice: 380.20, callChange: 10.2, callOI: '38.1k', callOIChange: '+2.4k', callIV: '11.8%', 
            callDelta: 0.88, callTheta: -2.4, callGamma: 0.0003, callVega: 1.8,
            putPrice: 25.40, putChange: -8.1, putOI: '15.2k', putOIChange: '+1.1k', putIV: '17.5%', 
            putDelta: -0.12, putTheta: -1.5, putGamma: 0.0002, putVega: 1.1,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22200, 
            callPrice: 310.60, callChange: 8.4, callOI: '52.4k', callOIChange: '+5.1k', callIV: '11.2%', 
            callDelta: 0.75, callTheta: -2.8, callGamma: 0.0004, callVega: 2.2,
            putPrice: 48.60, putChange: -12.3, putOI: '18.9k', putOIChange: '+2.5k', putIV: '16.8%', 
            putDelta: -0.25, putTheta: -1.8, putGamma: 0.0003, putVega: 1.4,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22300, 
            callPrice: 245.10, callChange: 5.2, callOI: '65.8k', callOIChange: '+8.2k', callIV: '10.8%', 
            callDelta: 0.62, callTheta: -3.2, callGamma: 0.0005, callVega: 2.5,
            putPrice: 78.40, putChange: -15.6, putOI: '22.4k', putOIChange: '+4.2k', putIV: '16.2%', 
            putDelta: -0.38, putTheta: -2.2, putGamma: 0.0004, putVega: 1.8,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22400, 
            callPrice: 190.40, callChange: 2.1, callOI: '72.1k', callOIChange: '+12.5k', callIV: '10.4%', 
            callDelta: 0.50, callTheta: -3.5, callGamma: 0.0006, callVega: 2.8,
            putPrice: 115.30, putChange: -18.2, putOI: '28.5k', putOIChange: '+6.1k', putIV: '15.7%', 
            putDelta: -0.50, putTheta: -2.5, putGamma: 0.0005, putVega: 2.1,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22500, 
            callPrice: 140.20, callChange: -1.5, callOI: '88.5k', callOIChange: '+15.2k', callIV: '10.1%', 
            callDelta: 0.38, callTheta: -3.2, callGamma: 0.0005, callVega: 2.5,
            putPrice: 165.70, putChange: 2.1, putOI: '35.1k', putOIChange: '+12.4k', putIV: '15.2%', 
            putDelta: -0.62, putTheta: -2.8, putGamma: 0.0004, putVega: 1.8,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22600, 
            callPrice: 95.80, callChange: -4.2, callOI: '62.4k', callOIChange: '+8.1k', callIV: '10.5%', 
            callDelta: 0.25, callTheta: -2.8, callGamma: 0.0004, callVega: 2.2,
            putPrice: 228.40, putChange: 5.4, putOI: '42.8k', putOIChange: '+15.2k', putIV: '15.9%', 
            putDelta: -0.75, putTheta: -3.2, putGamma: 0.0003, putVega: 1.4,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22700, 
            callPrice: 62.40, callChange: -8.6, callOI: '48.2k', callOIChange: '+4.2k', callIV: '11.1%', 
            callDelta: 0.15, callTheta: -2.4, callGamma: 0.0003, callVega: 1.8,
            putPrice: 295.10, putChange: 8.7, putOI: '55.2k', putOIChange: '+18.1k', putIV: '16.5%', 
            putDelta: -0.85, putTheta: -3.5, putGamma: 0.0002, putVega: 1.1,
            date: '16 Mar 2026' 
        },
        { 
            strike: 22800, 
            callPrice: 38.20, callChange: -12.4, callOI: '35.7k', callOIChange: '+2.1k', callIV: '11.7%', 
            callDelta: 0.08, callTheta: -2.1, callGamma: 0.0002, callVega: 1.5,
            putPrice: 375.60, putChange: 11.2, putOI: '62.1k', putOIChange: '+22.4k', putIV: '17.2%', 
            putDelta: -0.92, putTheta: -3.8, putGamma: 0.0001, putVega: 0.8,
            date: '16 Mar 2026' 
        }
    ];
};

export const getDerivativeGuide = (category: string) => {
    const guides: Record<string, any> = {
        'fo': {
            title: 'Futures & Options',
            description: 'Derivatives are contracts that derive their value from an underlying asset like a stock or index.',
            steps: [
                { title: 'Options Basics', description: 'Calls give you the right to BUY, while Puts give you the right to SELL a stock at a fixed price.' },
                { title: 'Strike Price', description: 'This is the set price where you agree to buy or sell the stock in the future.' },
                { title: 'OI (Open Interest)', description: 'Total number of outstanding contracts. High OI suggests high interest/liquidity at that strike.' },
                { title: 'IV (Implied Volatility)', description: "Market's expectation of future volatility. High IV means higher premiums." },
                { title: 'Option Greeks', description: 'Delta, Gamma, Theta, and Vega help measure how sensitive an option price is to changes in price, time, and volatility.' },
                { title: 'Max Pain', description: 'The strike price where option buyers would lose the maximum amount of money, often acting as a magnet for price.' }
            ]
        },
        'currency': {
            title: 'Currency Derivatives',
            description: 'Contracts that allow you to trade in the exchange rate between two currencies.',
            steps: [
                { title: 'FX Pairs', description: 'Major pairs like USD/INR, EUR/INR allow you to hedge against currency risk.' },
                { title: 'Lot Sizes', description: 'Currency contracts usually have standard lot sizes (e.g., $1,000 per lot).' },
                { title: 'Cash Settled', description: 'Most currency derivatives in India are settled in cash (INR).' }
            ]
        }
    };
    return guides[category] || null;
};


export interface CurrencyData {
    pair: string;
    price: string;
    change: string;
    trend: string;
    history?: { date: string; price: number }[];
    volume?: number;
    share?: number;
}

export const getCurrencyPairs = (startDate?: string, endDate?: string, pair?: string): CurrencyData[] => {
    const pairs = ['USD/INR', 'EUR/INR', 'GBP/INR', 'JPY/INR'];
    const filteredPairs = pair && pair !== 'All' ? [pair] : pairs;
    
    return filteredPairs.map(p => {
        const basePrice = p === 'USD/INR' ? 83.25 : p === 'EUR/INR' ? 90.15 : p === 'GBP/INR' ? 105.40 : 0.55;
        const change = (Math.random() * 0.5 - 0.25).toFixed(2);
        
        // Generate history
        const history = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const isoDate = d.toISOString().split('T')[0];
            
            // Apply filtering logic
            if ((startDate && isoDate < startDate) || (endDate && isoDate > endDate)) continue;
            
            history.push({
                date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                price: parseFloat((basePrice + Math.random() * 2 - 1).toFixed(4))
            });
        }

        return {
            pair: p,
            price: basePrice.toFixed(4),
            change: `${change}%`,
            trend: parseFloat(change) >= 0 ? 'Up' : 'Down',
            history: history.reverse(),
            volume: Math.floor(Math.random() * 1000000) + 500000,
            share: parseFloat((15 + Math.random() * 20).toFixed(1))
        };
    });
};

export const getDerivativesSummary = () => {
    return {
        maxPainCalls: 22500,
        maxPainPuts: 22200,
        pcr: 0.85,
        indiaVix: 14.2,
        lastUpdated: '10:05 AM',
        expiryDate: '26 MAR 2026'
    };
};

export const getConversionRates = () => {
    return {
        'USD': 83.25,
        'EUR': 90.15,
        'GBP': 105.40,
        'JPY': 0.55,
        'INR': 1.0
    };
};
