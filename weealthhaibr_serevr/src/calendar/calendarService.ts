
export const getCalendarEvents = () => {
    return [
        {
            date: "May 22, 2024",
            time: "2:30 PM",
            title: "RBI Monetary Policy Meeting",
            location: "Mumbai, India",
            impact: "High",
            description: "Interest rate decision and economic outlook by Governor Shaktikanta Das.",
            category: "Policy",
            type: 'catalyst'
        },
        {
            date: "Jun 04, 2024",
            time: "8:00 AM",
            title: "General Election Results",
            location: "Pan-India",
            impact: "Critical",
            description: "Vote counting for the 2024 Lok Sabha elections. Expected to drive extreme market volatility.",
            category: "Elections",
            type: 'catalyst'
        },
        {
            date: "Jun 12, 2024",
            time: "11:30 PM",
            title: "US FED Meeting",
            location: "Washington, DC",
            impact: "High",
            description: "FOMC interest rate decision and press conference by Chair Jerome Powell.",
            category: "FED",
            type: 'catalyst'
        },
        {
            date: "Jul 18, 2024",
            time: "6:15 PM",
            title: "European Central Bank Meeting",
            location: "Frankfurt, EU",
            impact: "Medium",
            description: "ECB interest rate decision and policy statement regarding inflation control.",
            category: "ECB",
            type: 'catalyst'
        },
        { date: 'Apr 25, 2024', company: 'Reliance Industries Ltd', event: 'Q4 Earnings Release', impact: 'High', type: 'earnings' },
        { date: 'Apr 26, 2024', company: 'HDFC Bank', event: 'Annual Financial Result', impact: 'High', type: 'earnings' },
        { date: 'Apr 28, 2024', company: 'Infosys', event: 'Earnings Call', impact: 'Medium', type: 'earnings' },
        { date: 'May 02, 2024', company: 'CSB Bank', event: 'Board Meeting', impact: 'Low', type: 'earnings' },
    ];
};
