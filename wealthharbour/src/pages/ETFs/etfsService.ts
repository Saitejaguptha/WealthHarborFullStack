/**
 * ETFs Page Service — Client-side entry point for the ETFs listing page.
 * All logic is delegated to the server.
 */
import { ETFService } from '../../services/api';

/**
 * Fetch ETFs list from the server.
 */
export const getETFs = async () => {
    return await ETFService.getETFs();
};

/**
 * Client-side logic for filtering (kept minimal as per request).
 */
export const filterETFsData = (
    etfs: any[],
    searchTerm: string,
    selectedSector: string,
    selectedCap: string
): any[] => {
    return etfs.filter(etf => {
        const matchesSearch = etf.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             etf.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = selectedSector === 'All' || etf.sector === selectedSector;
        const matchesCap = selectedCap === 'All' || etf.marketCap === selectedCap;
        return matchesSearch && matchesSector && matchesCap;
    });
};
