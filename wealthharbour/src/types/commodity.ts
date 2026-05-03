export interface CommodityPricePoint {
    date: string;
    price: number;
    volume: number;
}

export interface CommodityData {
    id: string;
    name: string;
    symbol: string;
    unit: string;
    currency: string;
    category: 'Energy' | 'Metals' | 'Utilities';
    currentPrice: number;
    currentVolume: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    history: CommodityPricePoint[];
    icon: string;
    color: string;
}
