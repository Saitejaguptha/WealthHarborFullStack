import { MetalService } from '../../services/api';
import { type MetalData } from '../../types/metals';
import { OUNCE_CONVERSION, USD_CONVERSION } from './goldSilverData';

/**
 * Fetch gold and silver prices from the metal service.
 */
export const fetchMetalData = async (): Promise<[MetalData, MetalData]> => {
    return await Promise.all([
        MetalService.getGoldData(),
        MetalService.getSilverData()
    ]);
};

/**
 * Calculate the price based on weight unit and currency preference.
 */
export const calculateAdjustedPrice = (
    basePrice: number, 
    unit: 'gram' | 'ounce', 
    currency: string
): number => {
    let adjustedPrice = unit === 'ounce' ? basePrice * OUNCE_CONVERSION : basePrice;

    if (currency === 'USD') {
        adjustedPrice = adjustedPrice * USD_CONVERSION;
    }

    return adjustedPrice;
};

/**
 * Formats a numeric price into a localized currency string.
 */
export const formatCurrency = (price: number, currency: string): string => {
    return price.toLocaleString('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: currency === 'USD' ? 2 : 3,
        minimumFractionDigits: 0,
    });
};
