const mockREITs = [
    {
        id: 'embassy-office-parks-reit',
        name: 'Embassy Office Parks REIT',
        symbol: 'EMBASSY',
        yield: '6.5%',
        type: 'Commercial Office',
        area: '34.2M sq.ft',
        occupancy: '87%',
        sponsor: 'Embassy Group & Blackstone',
        walt: '7.1 Years',
        price: '₹342',
        change: '+1.2%',
        description: "Asia's first and largest commercial REIT. Primarily focused on high-quality office parks in India's top IT hubs (Bengaluru, Pune, Mumbai, Noida). Features an expansive portfolio of enterprise tenants and multinational corporations.",
        locationSplit: [
            { city: 'Bengaluru', pct: '40%' },
            { city: 'NCR / Noida', pct: '25%' },
            { city: 'Mumbai', pct: '20%' },
            { city: 'Pune', pct: '15%' }
        ]
    },
    {
        id: 'mindspace-business-parks-reit',
        name: 'Mindspace Business Parks REIT',
        symbol: 'MINDSPACE',
        yield: '6.2%',
        type: 'Commercial Office',
        area: '31.3M sq.ft',
        occupancy: '84%',
        sponsor: 'K Raheja Corp & Blackstone',
        walt: '6.5 Years',
        price: '₹318',
        change: '+0.8%',
        description: 'A prominent office REIT offering well-diversified IT parks across major metropolitan city tech belts. Solid tenant base with high retention ratios.',
        locationSplit: [
            { city: 'Mumbai', pct: '38%' },
            { city: 'Hyderabad', pct: '32%' },
            { city: 'Pune', pct: '20%' },
            { city: 'Chennai', pct: '10%' }
        ]
    },
    {
        id: 'brookfield-india-real-estate',
        name: 'Brookfield India Real Estate',
        symbol: 'BIRET',
        yield: '6.8%',
        type: 'Commercial/Mixed',
        area: '18.7M sq.ft',
        occupancy: '82%',
        sponsor: 'Brookfield Asset Management',
        walt: '6.0 Years',
        price: '₹278',
        change: '+0.5%',
        description: "India's only institutionally managed public commercial real estate vehicle, sponsored by an affiliate of Brookfield Asset Management. High-yield generation focused on campus-style IT parks.",
        locationSplit: [
            { city: 'Mumbai', pct: '35%' },
            { city: 'Gurugram', pct: '30%' },
            { city: 'Noida', pct: '20%' },
            { city: 'Kolkata', pct: '15%' }
        ]
    }
];

export const getAllREITs = () =>
    mockREITs.map(({ id, name, symbol, yield: y, type, area, price, change }) => ({
        id, name, symbol, yield: y, type, area, price, change
    }));

export const getREITDetails = (id: string) => {
    const reit = mockREITs.find(r =>
        r.id === id.toLowerCase() || r.name.toLowerCase() === id.toLowerCase()
    );
    return reit || null;
};
