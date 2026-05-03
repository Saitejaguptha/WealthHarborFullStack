export interface MetalPricePoint {
    date: string;
    price: number;
}

export interface MetalData {
    name: string;
    currentPrice: number;
    currency: string;
    unit: 'gram' | 'ounce';
    history: MetalPricePoint[];
}
