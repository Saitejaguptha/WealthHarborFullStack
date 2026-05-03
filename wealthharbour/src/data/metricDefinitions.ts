
export interface MetricDefinition {
    name: string;
    description: string;
    formula?: string;
}

export const METRIC_GLOSSARY: Record<string, MetricDefinition> = {
    // Stocks
    'P/E Ratio': {
        name: 'Price-to-Earnings Ratio',
        description: 'The ratio of a company\'s share price to its earnings per share. It helps determine if a stock is overvalued or undervalued.',
        formula: 'P/E Ratio = Market Value per Share / Earnings per Share (EPS)'
    },
    'Market Price': {
        name: 'Market Price',
        description: 'The current price at which an asset is being traded in the open market.',
        formula: 'Determined by the supply and demand in the exchange.'
    },
    'Market Cap': {
        name: 'Market Capitalization',
        description: 'The total value of all a company\'s shares of stock.',
        formula: 'Market Cap = Current Share Price x Total Number of Outstanding Shares'
    },
    'Div. Yield': {
        name: 'Dividend Yield',
        description: 'The ratio of a company\'s annual dividend compared to its share price.',
        formula: 'Dividend Yield = (Annual Dividend per Share / Current Share Price) x 100'
    },
    'ROCE': {
        name: 'Return on Capital Employed',
        description: 'A financial ratio that measures a company\'s profitability and the efficiency with which its capital is used.',
        formula: 'ROCE = Earnings Before Interest and Tax (EBIT) / Capital Employed'
    },
    'Debt to Equity': {
        name: 'Debt-to-Equity Ratio',
        description: 'A measure of the degree to which a company is financing its operations through debt versus wholly-owned funds.',
        formula: 'Debt-to-Equity = Total Liabilities / Total Shareholders\' Equity'
    },
    'Net Profit': {
        name: 'Net Profit',
        description: 'The actual profit after working expenses not included in the calculation of gross profit have been paid.',
        formula: 'Net Profit = Total Revenue - Total Expenses'
    },

    // Mutual Funds
    'NAV': {
        name: 'Net Asset Value',
        description: 'The value per share/unit of a mutual fund or ETF. It is the price at which investors buy or sell units of the fund.',
        formula: 'NAV = (Total Assets - Total Liabilities) / Number of Outstanding Units'
    },
    'Alpha': {
        name: 'Alpha',
        description: 'The excess return of an investment relative to the return of a benchmark index. A positive alpha means the fund outperformed its benchmark.',
        formula: 'Alpha = Actual Return - [Risk-Free Rate + Beta x (Market Return - Risk-Free Rate)]'
    },
    'Beta': {
        name: 'Beta',
        description: 'A measure of a fund\'s volatility relative to the overall market (benchmark). A beta of 1 means it moves with the market.',
        formula: 'Beta = Covariance(Fund Return, Market Return) / Variance(Market Return)'
    },
    'Expense Ratio': {
        name: 'Expense Ratio',
        description: 'The annual fee that all funds or ETFs charge their unit holders. It covers management fees, administrative costs, and marketing.',
        formula: 'Expense Ratio = (Total Fund Operating Expenses / Total Fund Assets) x 100'
    },
    'Exit Load': {
        name: 'Exit Load',
        description: 'A fee charged by AMCs at the time of redemption of mutual fund units if redeemed before a specified period.',
        formula: 'Exit Load = NAV x Exit Load Percentage'
    },
    'Sharpe Ratio': {
        name: 'Sharpe Ratio',
        description: 'Measures risk-adjusted performance. A higher Sharpe ratio indicates better reward per unit of risk.',
        formula: 'Sharpe Ratio = (Fund Return - Risk-Free Rate) / Standard Deviation'
    },
    'Sortino Ratio': {
        name: 'Sortino Ratio',
        description: 'Similar to Sharpe, but only considers downside risk. Better for highlighting protection against negative returns.',
        formula: 'Sortino Ratio = (Fund Return - Risk-Free Rate) / Downside Deviation'
    },
    'Standard Deviation': {
        name: 'Standard Deviation',
        description: 'A mathematical measure of volatility. It shows how much the fund\'s returns deviate from its average.',
        formula: 'σ = sqrt[ Σ(Ri - Ravg)² / n ]'
    },
    'Std. Deviation': {
        name: 'Standard Deviation',
        description: 'A mathematical measure of volatility. It shows how much the fund\'s returns deviate from its average.',
        formula: 'σ = sqrt[ Σ(Ri - Ravg)² / n ]'
    },
    'AUM': {
        name: 'Assets Under Management',
        description: 'The total market value of the investments managed by the fund.',
        formula: 'Total Value of Portfolio Securities + Cash - Liabilities'
    },

    // ETFs & Indices
    'Tracking Error': {
        name: 'Tracking Error',
        description: 'The difference between the performance of an ETF and its underlying benchmark index.',
        formula: 'Tracking Error = Standard Deviation of (ETF Return - Benchmark Return)'
    },
    'Tracking Difference': {
        name: 'Tracking Difference',
        description: 'The actual underperformance or overperformance of an ETF relative to its benchmark over a specific period.',
        formula: 'Tracking Difference = ETF Return - Benchmark Return'
    },
    'Index P/E Ratio': {
        name: 'Index Price-to-Earnings Ratio',
        description: 'The weighted average P/E ratio of all the companies included in the market index.',
        formula: 'Σ (Weight_i x PE_i) of all constituent stocks'
    },
    'Index P/B Ratio': {
        name: 'Index Price-to-Book Ratio',
        description: 'The weighted average P/B ratio of all the companies included in the market index.',
        formula: 'Σ (Weight_i x PB_i) of all constituent stocks'
    },
    'PE Ratio': {
        name: 'Price-to-Earnings Ratio (ETF)',
        description: 'The weighted average of the P/E ratios of all companies in the ETF\'s portfolio.',
        formula: 'Σ (Weight_i x PE_i)'
    },
    'Yield': {
        name: 'Dividend Yield',
        description: 'The annual dividends distributed by the ETF as a percentage of its current price.',
        formula: 'Yield = (Dividends / ETF Price) x 100'
    },
    'Dividend Yield': {
        name: 'Dividend Yield',
        description: 'The annual dividends distributed by the asset as a percentage of its current price.',
        formula: 'Yield = (Dividends / Price) x 100'
    },
    'Liquidity Score': {
        name: 'Liquidity Score',
        description: 'An internal metric measuring the ease of buying or selling the ETF without affecting its price.',
        formula: 'Based on average volume, bid-ask spread, and impact cost.'
    },
    'Bid-Ask Spread': {
        name: 'Bid-Ask Spread',
        description: 'The difference between the highest price a buyer is willing to pay and the lowest price a seller is willing to accept.',
        formula: 'Spread = (Ask Price - Bid Price) / Ask Price x 100'
    },
    'Avg. Volume': {
        name: 'Average Daily Volume',
        description: 'Typical number of ETF units traded per day. Higher volume usually means tighter spreads and easier execution.',
    },
    'Discount/Prem': {
        name: 'Discount/Premium to NAV',
        description: 'The difference between the market price of an ETF and its Net Asset Value (NAV). a Discount means it trades below NAV; a Premium means it trades above.',
        formula: '((Market Price - NAV) / NAV) x 100'
    }
};
