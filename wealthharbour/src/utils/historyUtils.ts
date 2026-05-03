import type { PriceHistoryPoint } from '../types/history';
import { roundToMaxDecimals, DISPLAY_MAX_DECIMALS } from './numberFormat';

export const generatePriceHistory = (basePrice: number, days: number = 30): PriceHistoryPoint[] => {
    const history: PriceHistoryPoint[] = [];
    const now = new Date();

    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        // Random walk for price
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
