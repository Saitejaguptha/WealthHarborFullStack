/**
 * Server-side utility helpers for data generation.
 */

export const DISPLAY_MAX_DECIMALS = 3;

export const roundToMaxDecimals = (num: number, maxDecimals: number): number =>
    parseFloat(num.toFixed(maxDecimals));

export interface PriceHistoryPoint {
    date: string;
    price: number;
}

/**
 * Generates a random-walk price history for mock data.
 */
export const generatePriceHistory = (basePrice: number, days: number = 30): PriceHistoryPoint[] => {
    const history: PriceHistoryPoint[] = [];
    const now = new Date();
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        const volatility = currentPrice * 0.02;
        const priceChange = (Math.random() - 0.5) * volatility;
        currentPrice += priceChange;

        history.push({
            date: date.toISOString().split('T')[0],
            price: roundToMaxDecimals(currentPrice, DISPLAY_MAX_DECIMALS)
        });
    }

    return history;
};
