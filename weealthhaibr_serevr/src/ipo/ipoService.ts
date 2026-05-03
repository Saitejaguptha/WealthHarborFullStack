const mockIPOs = [
    { 
        id: '1',
        name: 'WealthTech Solutions', 
        date: '2024-04-20', 
        priceRange: '₹450 - ₹475', 
        status: 'Open', 
        issueSize: '₹1,500 Cr', 
        lotSize: 30, 
        gmp: '₹85', 
        gmpPercentage: '17.9%',
        listingExpected: '₹560',
        subscription: '2.4x',
        category: 'Mainboard'
    },
    { 
        id: '2',
        name: 'GreenEnergy Corp', 
        date: '2024-04-22', 
        priceRange: '₹120 - ₹130', 
        status: 'Upcoming', 
        issueSize: '₹800 Cr', 
        lotSize: 100, 
        gmp: '₹30', 
        gmpPercentage: '23.1%',
        listingExpected: '₹160',
        subscription: '-',
        category: 'SME'
    },
    { 
        id: '3',
        name: 'Quantum AI Systems', 
        date: '2024-04-25', 
        priceRange: '₹890 - ₹920', 
        status: 'Upcoming', 
        issueSize: '₹2,200 Cr', 
        lotSize: 15, 
        gmp: '₹150', 
        gmpPercentage: '16.3%',
        listingExpected: '₹1,070',
        subscription: '-',
        category: 'Mainboard'
    },
    { 
        id: '4',
        name: 'Tata Technologies', 
        date: '2023-11-22', 
        priceRange: '₹475 - ₹500', 
        status: 'Listed', 
        issueSize: '₹3,042 Cr', 
        lotSize: 30, 
        gmp: '₹0', 
        gmpPercentage: '0%',
        listingExpected: '₹1,200',
        subscription: '69.4x',
        category: 'Mainboard',
        listingPrice: '₹1,200',
        listingGain: '140%'
    },
    { 
        id: '5',
        name: 'IREDA', 
        date: '2023-11-21', 
        priceRange: '₹30 - ₹32', 
        status: 'Listed', 
        issueSize: '₹2,150 Cr', 
        lotSize: 460, 
        gmp: '₹0', 
        gmpPercentage: '0%',
        listingExpected: '₹50',
        subscription: '38.8x',
        category: 'Mainboard',
        listingPrice: '₹50',
        listingGain: '56.2%'
    },
    { 
        id: '6',
        name: 'JSW Infrastructure', 
        date: '2023-09-25', 
        priceRange: '₹113 - ₹119', 
        status: 'Listed', 
        issueSize: '₹2,800 Cr', 
        lotSize: 126, 
        gmp: '₹0', 
        gmpPercentage: '0%',
        listingExpected: '₹143',
        subscription: '37.3x',
        category: 'Mainboard',
        listingPrice: '₹143',
        listingGain: '20.1%'
    }
];

export const getAllIPOs = (status?: string, search?: string) => {
    let ipos = mockIPOs;
    
    if (status && status !== 'All') {
        ipos = ipos.filter(ipo => ipo.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
        const query = search.toLowerCase();
        ipos = ipos.filter(ipo => 
            ipo.name.toLowerCase().includes(query) || 
            ipo.category.toLowerCase().includes(query)
        );
    }

    return ipos;
};


export const getIPODetails = (name: string) => {
    const ipo = mockIPOs.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!ipo) return null;
    
    // Enrich with additional details for "Know More" page
    return {
        ...ipo,
        priceBand: ipo.priceRange,
        lotSize: `${ipo.lotSize} Shares`,
        listingDate: '2024-05-02',
        riskStatus: 'Moderate',

        financials: {
            profits: '₹150 Cr (FY23)',
            revenue: '₹850 Cr (FY23)',
            assets: '₹1,200 Cr (FY23)',
            liabilities: '₹350 Cr (FY23)',
        },

        quarterlyResults: [
            { quarter: 'Q3 FY24', revenue: '₹450 Cr', pat: '₹85 Cr' },
            { quarter: 'Q2 FY24', revenue: '₹410 Cr', pat: '₹72 Cr' },
            { quarter: 'Q1 FY24', revenue: '₹380 Cr', pat: '₹65 Cr' }
        ],

        profitAndLoss: [
            { year: 'FY23', sales: '₹1,500 Cr', expenses: '₹1,200 Cr', pat: '₹250 Cr' },
            { year: 'FY22', sales: '₹1,200 Cr', expenses: '₹950 Cr', pat: '₹180 Cr' }
        ],

        balanceSheet: [
            { year: 'FY23', shareCapital: '₹100 Cr', reserves: '₹800 Cr', borrowings: '₹150 Cr', otherLiabilities: '₹200 Cr', totalAssets: '₹1,250 Cr' },
            { year: 'FY22', shareCapital: '₹100 Cr', reserves: '₹600 Cr', borrowings: '₹200 Cr', otherLiabilities: '₹150 Cr', totalAssets: '₹1,050 Cr' }
        ],

        cashFlows: {
            operating: '₹300 Cr',
            investing: '-₹150 Cr',
            financing: '-₹50 Cr',
            net: '₹100 Cr'
        },
        
        revenueMix: [
            { segment: 'Software Services', contribution: '60%' },
            { segment: 'Cloud Infrastructure', contribution: '30%' },
            { segment: 'Consulting', contribution: '10%' }
        ],

        peerComparison: [
            { company: `${ipo.name} (IPO)`, pe: '25x', roe: '18%', mcap: '₹4,500 Cr' },
            { company: 'Finserve Ltd', pe: '32x', roe: '15%', mcap: '₹12,000 Cr' },
            { company: 'TechSolutions', pe: '28x', roe: '16%', mcap: '₹8,000 Cr' }
        ],

        keySuppliers: [
            'Amazon Web Services (AWS)', 'Microsoft Azure', 'Cisco Systems', 'Oracle'
        ],

        investorDocuments: [
            { title: 'Draft Red Herring Prospectus (DRHP)', url: '#', date: 'Jan 2024' },
            { title: 'Red Herring Prospectus (RHP)', url: '#', date: 'Apr 2024' },
            { title: 'Anchor Investor Allocation', url: '#', date: 'Apr 2024' }
        ],

        investmentViews: [
            { brokerage: 'Alpha Capital', view: 'Subscribe', rationale: 'Strong margins and leadership in the digital wealth space.' },
            { brokerage: 'Beta Securities', view: 'Subscribe for Long Term', rationale: 'Valuation is slightly stretched but growth prospects are solid.' }
        ],

        scoresAndValuation: {
            piotroskiScore: 7,
            altmanZScore: 4.5,
            valuation: 'Fairly Valued',
            peRatio: '25.4x'
        },

        investorDetails: {
            promoters: '65%',
            qib: '20%',
            nii: '10%',
            retail: '5%',
        },
        
        shareholdingPattern: [
            { category: 'Promoters', preIssue: '85%', postIssue: '65%' },
            { category: 'Public / QIB', preIssue: '15%', postIssue: '35%' }
        ],

        about: `${ipo.name} is a leading player in its respective sector, planning to raise ${ipo.issueSize} through this initial public offering. The funds will be utilized for expansion and debt reduction.`
    };
};

