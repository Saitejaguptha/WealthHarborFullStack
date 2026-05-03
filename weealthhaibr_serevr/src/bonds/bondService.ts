const mockBonds = [
    {
        id: 'reserve-bank-of-india-bond',
        name: 'Reserve Bank of India Bond (Floating Rate Savings)',
        displayName: 'Reserve Bank of India Bond',
        issuer: 'Reserve Bank of India',
        type: 'Government Bond (Sovereign)',
        yield: '8.05%',
        faceValue: '₹1,000',
        minInvestment: '₹1,000',
        maxInvestment: 'No Limit',
        interestRate: '8.05% (Floating, reset half-yearly)',
        interestPayment: 'Half Yearly (1st Jan, 1st July)',
        tenure: '7 Years',
        duration: '7 Years',
        rating: 'Sovereign Guarantee',
        issueSize: 'Not Applicable (On-Tap)',
        taxStatus: 'Taxable as per slab',
        description: 'Floating Rate Savings Bonds by the Reserve Bank of India providing 100% principal protection with interest linked to National Savings Certificate.'
    },
    {
        id: 'nhai-infrastructure-bond',
        name: 'NHAI Tax Free Infrastructure Bond',
        displayName: 'NHAI Infrastructure Bond',
        issuer: 'National Highways Authority of India',
        type: 'Tax-Free Public Sector Bond',
        yield: '6.8%',
        faceValue: '₹1,000',
        minInvestment: '₹10,000',
        maxInvestment: '₹10,00,000 for Retail',
        interestRate: '6.80% Tax-Free',
        interestPayment: 'Annual',
        tenure: '15 Years',
        duration: '5 Years',
        rating: 'AAA',
        issueSize: '₹10,000 Cr',
        taxStatus: 'Tax Free Sec 10(15)(iv)(h)',
        description: 'AAA-rated, secure tax-free bonds issued to fund national highway development, creating high long-term post-tax yields for upper tax bracket investors.'
    },
    {
        id: 'sovereign-gold-bond-2024',
        name: 'Sovereign Gold Bond 2024 (Series I)',
        displayName: 'Sovereign Gold Bond 2024',
        issuer: 'Govt. of India (via RBI)',
        type: 'Gold Linked Bond',
        yield: '2.5% + Capital Gains',
        faceValue: 'Per Gram of Gold',
        minInvestment: '1 Gram',
        maxInvestment: '4 KGs (Individual)',
        interestRate: '2.50% p.a.',
        interestPayment: 'Half Yearly',
        tenure: '8 Years (Exit option after 5th yr)',
        duration: '8 Years',
        rating: 'Sovereign',
        issueSize: 'Tranche Based',
        taxStatus: 'Capital Gains Tax-Free on Maturity',
        description: 'A superior alternative to holding physical gold. Investors earn a fixed 2.5% interest atop the market appreciation of gold. Capital gains are fully tax-exempt if held to maturity.'
    }
];

export const getAllBonds = () =>
    mockBonds.map(({ id, displayName: name, yield: y, duration, rating }) => ({ id, name, yield: y, duration, rating }));

export const getBondDetails = (id: string) => {
    const bond = mockBonds.find(b =>
        b.id === id.toLowerCase() ||
        b.displayName.toLowerCase() === id.toLowerCase() ||
        b.name.toLowerCase() === id.toLowerCase()
    );
    return bond || null;
};
