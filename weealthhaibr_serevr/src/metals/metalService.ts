/**
 * Metal Service — Server-side data generation and access.
 */
import { roundToMaxDecimals, DISPLAY_MAX_DECIMALS } from '../utils/helpers';

const generateMetalHistory = (basePrice: number, days: number = 30) => {
    const history: { date: string; price: number }[] = [];
    const now = new Date();
    let currentPrice = basePrice;
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        currentPrice += (Math.random() - 0.5) * currentPrice * 0.01;
        history.push({ date: date.toISOString().split('T')[0], price: roundToMaxDecimals(currentPrice, DISPLAY_MAX_DECIMALS) });
    }
    return history;
};

export const getGoldData = () => {
    const history = generateMetalHistory(7500);
    return { name: 'Gold', currentPrice: history[history.length - 1].price, currency: 'INR', unit: 'gram', history };
};

export const getSilverData = () => {
    const history = generateMetalHistory(95);
    return { name: 'Silver', currentPrice: history[history.length - 1].price, currency: 'INR', unit: 'gram', history };
};

export const getMetalForecast = () => {
    return {
        gold: {
            title: "Gold Future Outlook",
            whyIncrease: [
                "Geopolitical tensions often drive investors to safe-haven assets like gold.",
                "Central banks globally are increasing their gold reserves to hedge against currency devaluation.",
                "Expected interest rate cuts by major central banks make non-yielding gold more attractive."
            ],
            signals: {
                buy: {
                    chance: "65%",
                    condition: "If price breaks above resistance or economic uncertainty peaks."
                },
                wait: {
                    chance: "25%",
                    condition: "During short-term consolidation or ahead of major inflation data releases."
                },
                sell: {
                    chance: "10%",
                    condition: "If global interest rates rise unexpectedly or geopolitical stability improves."
                }
            }
        },
        silver: {
            title: "Silver Market Forecast",
            whyIncrease: [
                "Rising demand in green technologies like solar panels and electric vehicles (EVs).",
                "Silver's dual role as both an industrial metal and a precious metal provides unique growth vectors.",
                "Historical gold-to-silver ratio suggests silver is undervalued relative to gold."
            ],
            signals: {
                buy: {
                    chance: "70%",
                    condition: "Accumulate on dips below major support levels as industrial demand scales."
                },
                wait: {
                    chance: "20%",
                    condition: "If industrial growth slows down temporarily in major economies."
                },
                sell: {
                    chance: "10%",
                    condition: "Significant technological shift reducing industrial silver usage."
                }
            }
        }
    };
};

