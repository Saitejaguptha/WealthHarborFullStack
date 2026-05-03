export interface FIIData {
    date: string;
    fiiNet: number;
    diiNet: number;
    totalNet: number;
}

export const getFIIDIIActivity = (startDate?: string, endDate?: string): FIIData[] => {
    const data: FIIData[] = [];
    const today = new Date();
    
    // Generate data for the last 60 days
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const fiiNet = Math.floor(Math.random() * 6000) - 3000;
        const diiNet = Math.floor(Math.random() * 6000) - 3000;
        const totalNet = fiiNet + diiNet;
        data.push({
            date: date.toISOString().split('T')[0], // Use ISO date for easier filtering
            fiiNet,
            diiNet,
            totalNet
        });
    }

    // Filter by date if provided
    let filteredData = data;
    if (startDate) {
        filteredData = filteredData.filter(d => d.date >= startDate);
    }
    if (endDate) {
        filteredData = filteredData.filter(d => d.date <= endDate);
    }

    // Convert back to display format for frontend
    return filteredData.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }));
};

