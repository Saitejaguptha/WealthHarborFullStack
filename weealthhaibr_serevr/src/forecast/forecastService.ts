
export const getIndianIndicators = () => {
    return [
        {
            title: "Real GDP Growth",
            history: [{ year: '22', val: '7.2%' }, { year: '23', val: '7.0%' }],
            forecast: '7.1%',
            status: 'Expanding',
            color: 'emerald',
            change: 'up',
            insight: "Sustained by capital expenditure and massive infrastructure scaling."
        },
        {
            title: "Consumer Inflation",
            history: [{ year: '22', val: '6.7%' }, { year: '23', val: '5.4%' }],
            forecast: '4.5%',
            status: 'Moderating',
            color: 'rose',
            change: 'down',
            insight: "RBI's tightening cycle and cooling input costs are stabilizing prices."
        },
        {
            title: "Labor Dynamics",
            history: [{ year: '22', val: '7.9%' }, { year: '23', val: '7.1%' }],
            forecast: '6.8%',
            status: 'Improving',
            color: 'amber',
            change: 'down',
            insight: "Digital transformation and manufacturing PLI schemes yielding results."
        },
        {
            title: "PPP Valuation",
            history: [{ year: '22', val: '$11.8T' }, { year: '23', val: '$13.1T' }],
            forecast: '$14.5T',
            status: 'Global Top 3',
            color: 'indigo',
            change: 'up',
            insight: "India's massive domestic consumption base continues to drive total PPP."
        }
    ];
};

export const getQuarterlyPulse = () => {
    return [
        { period: 'Q1 2024', stat: '7.8%', desc: 'Industrial Upswing' },
        { period: 'Q2 2024', stat: '7.2%', desc: 'Internal Demand' },
        { period: 'Q3 2024', stat: '6.9%', desc: 'Global Headwinds' },
        { period: 'Q4 2024', stat: '6.8%', desc: 'Stabilized Growth' }
    ];
};
