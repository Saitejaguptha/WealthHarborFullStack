
export const getIntradayPicks = () => {
    return [
        { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,445.20', signal: 'Buy Above 1450', target: '1465', sl: '1435', strength: 'Strong' },
        { symbol: 'RELIANCE', name: 'Reliance Ind.', price: '₹2,980.50', signal: 'Sell Below 2975', target: '2950', sl: '3000', strength: 'Moderate' },
        { symbol: 'INFY', name: 'Infosys', price: '₹1,560.10', signal: 'Buy Near 1555', target: '1580', sl: '1545', strength: 'Strong' },
    ];
};

export const getIntradayDetails = (symbol: string) => {
    return {
        symbol,
        name: symbol === 'HDFCBANK' ? 'HDFC Bank' : symbol === 'RELIANCE' ? 'Reliance Ind.' : 'Infosys',
        price: '₹1,445.20',
        signal: 'Buy Above 1450',
        target: '1465',
        sl: '1435',
        strength: 'Strong',
        reason: 'Breaking out of a 15-minute consolidation zone with high volume.',
        levels: {
            r1: '1455',
            r2: '1465',
            s1: '1440',
            s2: '1435'
        }
    };
};
