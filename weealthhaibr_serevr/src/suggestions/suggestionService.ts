
export const getSuggestions = (preferences: any) => {
    const { type, cap, timeHorizon } = preferences;
    
    return type.map((t: string) => {
        let whyBuy = `Investing in ${t} aligns perfectly with your ${timeHorizon?.[0] || 'stated'} horizon, offering a balanced risk-reward ratio in the current economic cycle.`;
        if (t === 'Stocks') {
            whyBuy = "Current market valuations in your selected cap represent a strong entry point. Strong quarterly results across sectors indicate a recovery phase.";
        } else if (t === 'MF') {
            whyBuy = "Professional management and diversification across multiple sectors reduce unsystematic risk while capturing alpha.";
        }

        const pros = [
            `High potential for capital appreciation over ${timeHorizon?.[0] || 'long term'}.`,
            cap.includes('Large Cap') ? 'Stable dividends and lower volatility.' : 'Agile growth and potential for multi-bagger returns.'
        ];

        const cons = [
            'Subject to market volatility and tracking error.',
            'Short-term capital gains tax may impact net returns.'
        ];

        return {
            type: t,
            whyBuy,
            reasoning: `Based on Indian Forecast Stats, the interest rate cycle is peaking, which historically favors ${t}. Capital allocation to these assets ensures liquidity while maintaining growth momentum.`,
            pros,
            cons
        };
    });
};
