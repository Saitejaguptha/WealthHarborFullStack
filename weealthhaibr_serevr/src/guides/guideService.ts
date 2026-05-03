
export const getGuide = (category: string) => {
    const guides: Record<string, any> = {
        'ipo': {
            title: 'Initial Public Offerings (IPOs)',
            description: 'IPOs allow companies to raise capital by selling shares to the public for the first time.',
            steps: [
                { title: 'The Launchpad', description: 'An IPO is the first time a private company sells its shares to the general public to raise money.' },
                { title: 'Lots & Prices', description: 'Shares are usually sold in "lots" (bundles). You apply at a set price range.' },
                { title: 'Listing Gains', description: 'Investors often look for "Listing Gains," which happens if the share price opens higher than the IPO price.' },
                { title: 'GMP (Grey Market Premium)', description: 'GMP is the unofficial premium at which IPO shares are traded before they are listed on the stock exchange. It indicates the demand for the IPO.' }
            ]
        },
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
        'bonds': {
            title: 'Securities & Bonds',
            description: 'Bonds are fixed-income instruments that represent a loan made by an investor to a borrower.',
            steps: [
                { title: 'Loan to Govt/Corp', description: 'When you buy a bond, you are essentially lending money to the government or a company for a set period.' },
                { title: 'Fixed Interest', description: 'In return for your loan, you get regular interest payments (coupons) and your initial money back at the end.' },
                { title: 'Yield vs Price', description: 'Bond prices move inversely to interest rates. When interest rates go up, bond prices usually go down.' },
                { title: 'Credit Rating', description: 'Ratings (like AAA or AA+) tell you how likely the borrower is to pay back the loan.' }
            ]
        },
        'stocks': {
            title: 'Stock Market Basics',
            description: 'Buying a stock means owning a small piece of a company.',
            steps: [
                { title: 'Equity Ownership', description: 'When you buy a stock, you become a partial owner of the company and may benefit from its growth.' },
                { title: 'Market Cap', description: 'The total value of a company. Large-cap (big), Mid-cap (medium), Small-cap (small).' },
                { title: 'Dividends', description: 'Some companies share a part of their profits with shareholders as cash payments.' },
                { title: 'Fundamental vs Technical', description: 'Fundamentals look at business health, while Technicals look at price charts and trends.' }
            ]
        },
        'mf': {
            title: 'Mutual Funds',
            description: 'Mutual funds pool money from many investors to buy a diversified portfolio of securities.',
            steps: [
                { title: 'Diversification', description: 'Mutual funds pool money from many investors to buy a variety of stocks/bonds, reducing your risk.' },
                { title: 'Understanding NAV', description: 'Net Asset Value (NAV) is the price of one unit of the fund. It is updated daily after market close.' },
                { title: 'Expense Ratio', description: 'This is the fee paid to the fund house for managing your money. Lower is usually better.' }
            ]
        },
        'indices': {
            title: 'Market Indices',
            description: 'A market index tracks the performance of a group of stocks representing a segment of the market.',
            steps: [
                { title: 'The Market Pulse', description: 'An index is a collection of stocks that represents a specific part of the market (e.g., Top 50 companies).' },
                { title: 'NIFTY 50 & SENSEX', description: 'These are the major benchmark indices in India. If they go up, the general market sentiment is positive.' },
                { title: 'Sectoral Indices', description: 'You can also track specific sectors like Banking, IT, or Pharma to see which industries are leading.' }
            ]
        },
        'commodities': {
            title: 'Commodities Market',
            description: 'Commodities are raw materials or primary agricultural products used in commerce.',
            steps: [
                { title: 'Hard Assets', description: 'Commodities are basic goods used in commerce like oil, metals, and agricultural products.' },
                { title: 'Global Impact', description: 'Prices are driven by global supply and demand. e.g., A conflict in the Middle East can spike oil prices.' },
                { title: 'Inflation Hedge', description: 'Commodities often go up when the value of money goes down, making them a good hedge against inflation.' }
            ]
        },
        'etfs': {
            title: 'Exchange Traded Funds (ETFs)',
            description: 'ETFs are investment funds that are traded on stock exchanges, much like individual stocks.',
            steps: [
                { title: 'Stock-like Funds', description: 'ETFs are similar to mutual funds but can be bought and sold on the stock exchange like regular stocks.' },
                { title: 'Low Cost', description: 'Because they usually track an index, ETFs have much lower fees (expense ratios) than active mutual funds.' },
                { title: 'Instant Liquidity', description: 'You can buy or sell ETFs anytime during market hours at the current market price.' }
            ]
        },
        'watchlist': {
            title: 'Your Watchlist',
            description: 'A watchlist lets you track your high-conviction opportunities before committing capital.',
            steps: [
                { title: 'Identify Assets', description: 'Search for stocks, mutual funds, ETFs, indices, or commodities you want to track.' },
                { title: 'Monitor Trends', description: 'Watch short-term technicals and long-term fundamentals to time your entry.' },
                { title: 'Wait for the Setup', description: 'Patiently wait for your target price or catalyst before investing.' },
                { title: 'Execute Strategy', description: 'When the asset is ready, confidently execute your trade with conviction.' }
            ]
        },
        'market-summary': {
            title: 'Market Intelligence',
            description: 'The Market Summary page gives you a real-time overview of macroeconomic conditions, sentiment, and institutional activity driving the markets today.',
            steps: [
                { title: 'Market Sentiment', description: 'Reflects the overall mood of the market — Bullish (optimistic) or Bearish (pessimistic) based on price action and volume.' },
                { title: 'India VIX', description: 'Volatility Index — a "fear gauge". High VIX = high uncertainty. Low VIX = calm market. Inversely correlated with Nifty.' },
                { title: 'Top Sector', description: 'The best-performing sector of the day. Rotating into strong sectors is a core momentum strategy.' },
                { title: 'Structural Insights', description: 'Curated highlights of major institutional moves, policy changes, and global macro cues affecting the market.' }
            ]
        },
        'forecast': {
            title: 'Economic Forecasts',
            description: 'Forecasts help you understand the future trajectory of key macroeconomic indicators.',
            steps: [
                { title: 'GDP Growth', description: 'Tracks the overall health and expansion of the economy.' },
                { title: 'Inflation Rate', description: 'Measures the rate at which prices for goods and services are rising.' },
                { title: 'Interest Rates', description: 'Central bank rates that influence borrowing costs and economic activity.' },
                { title: 'Unemployment', description: 'A key indicator of labor market strength and consumer spending power.' }
            ]
        },
        'intraday': {
            title: 'Intraday Trading',
            description: 'Intraday trading involves buying and selling financial instruments within the same trading day.',
            steps: [
                { title: 'Day Trading Basics', description: 'Positions are closed before the market closes to avoid overnight risk.' },
                { title: 'Momentum', description: 'Traders look for highly liquid stocks with high momentum.' },
                { title: 'Stop Loss', description: 'A critical risk management tool to limit potential losses on a trade.' },
                { title: 'Technical Analysis', description: 'Using charts and patterns to predict short-term price movements.' }
            ]
        },
        'calendar': {
            title: 'Economic Calendar',
            description: 'Track key economic events, earnings releases, and central bank meetings that impact the markets.',
            steps: [
                { title: 'Earnings Season', description: 'Periods when public companies release their quarterly earnings reports.' },
                { title: 'Central Banks', description: 'Meetings where interest rates and monetary policy are decided.' },
                { title: 'Macro Data', description: 'Releases like GDP, CPI, and employment numbers.' }
            ]
        },
        'metals': {
            title: 'Precious Metals',
            description: 'Invest in gold, silver, and other precious metals as a store of value or inflation hedge.',
            steps: [
                { title: 'Safe Haven', description: 'Metals like gold are traditionally viewed as safe havens during economic uncertainty.' },
                { title: 'Inflation Hedge', description: 'Precious metals often retain their value better than fiat currencies during high inflation.' },
                { title: 'Industrial Use', description: 'Silver and platinum have significant industrial applications driving their demand.' }
            ]
        },
        'reits': {
            title: 'Real Estate Investment Trusts',
            description: 'Invest in income-producing real estate through liquid, publicly traded securities.',
            steps: [
                { title: 'Income Generation', description: 'REITs are legally required to distribute a large portion of their taxable income as dividends.' },
                { title: 'Diversification', description: 'Provides exposure to real estate without the hassle of property management.' },
                { title: 'Sectors', description: 'REITs can specialize in retail, office, residential, healthcare, or industrial properties.' }
            ]
        },
        'institutional': {
            title: 'Institutional Activity',
            description: 'Track the buying and selling patterns of Foreign Institutional Investors (FIIs) and Domestic Institutional Investors (DIIs).',
            steps: [
                { title: 'FII/FPI', description: 'Foreign entities investing in the domestic market. Their flows heavily influence market direction.' },
                { title: 'DII', description: 'Domestic mutual funds, insurance companies, and banks investing locally.' },
                { title: 'Net Inflows', description: 'When FIIs and DIIs are net buyers, the market usually trends upwards.' }
            ]
        },
        'market-analysis': {
            title: 'Market Analysis',
            description: 'In-depth breakdown of current market trends, technical setups, and fundamental indicators.',
            steps: [
                { title: 'Technical Indicators', description: 'Using moving averages, RSI, and MACD to identify potential reversals or breakouts.' },
                { title: 'Breadth', description: 'Analyzing the number of advancing vs. declining stocks to gauge the true strength of a rally.' },
                { title: 'Volume Analysis', description: 'Confirming price movements with trading volume.' }
            ]
        },
        'news': {
            title: 'Market News',
            description: 'Stay updated with the latest headlines, corporate announcements, and macroeconomic developments.',
            steps: [
                { title: 'Corporate Actions', description: 'News about dividends, stock splits, mergers, and acquisitions.' },
                { title: 'Global Cues', description: 'International news that can affect domestic market sentiment.' },
                { title: 'Regulatory Updates', description: 'Changes in government policies or exchange rules that impact trading.' }
            ]
        }
    };

    return guides[category] || null;
};
