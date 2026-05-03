import React, { useMemo, useState } from 'react';
import type { PriceHistoryPoint } from '../../types/history';
import { formatNumberEnIn } from '../../utils/numberFormat';

interface PriceHistoryChartProps {
    history: PriceHistoryPoint[];
    color?: string;
    height?: number;
    title?: string;
    currencySymbol?: string;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
    history,
    color = '#4F46E5',
    height = 250,
    title = "Price History",
    currencySymbol = "$"
}) => {
    const prices = history.map(h => h.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const VIEW_WIDTH = 800;
    const VIEW_HEIGHT = 200;
    const PADDING = 20;

    const [hoveredPoint, setHoveredPoint] = useState<PriceHistoryPoint | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const points = useMemo(() => {
        if (history.length === 0) return "";
        return history.map((h, i) => {
            const x = (i / (history.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
            const y = VIEW_HEIGHT - PADDING - ((h.price - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING);
            return `${x},${y}`;
        }).join(' ');
    }, [history, min, range]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;

        // Find nearest point
        const index = Math.round(((x - PADDING) / (VIEW_WIDTH - 2 * PADDING)) * (history.length - 1));
        if (index >= 0 && index < history.length) {
            setHoveredPoint(history[index]);
            // Calculate actual SVG coordinates for the cursor line
            const pointX = (index / (history.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
            setMousePos({ x: pointX, y: 0 });
        }
    };

    return (
        <div className="relative w-full min-w-0 max-w-full group/chart bg-white/50 backdrop-blur-sm rounded-[2rem] p-4 sm:p-6 border border-indigo-50 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-black text-indigo-950 uppercase tracking-widest">{title}</h3>
                    <p className="text-[10px] font-bold text-indigo-900/40 uppercase tracking-tighter">30-Day Historical Performance</p>
                </div>
                {hoveredPoint && (
                    <div className="text-right">
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{hoveredPoint.date}</p>
                        <p className="text-xl font-black text-indigo-950">{currencySymbol}{formatNumberEnIn(hoveredPoint.price)}</p>
                    </div>
                )}
            </div>

            <div style={{ height: `${height}px` }} className="relative">
                <svg
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                    className="w-full h-full cursor-crosshair touch-pan-y"
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onTouchMove={(e) => {
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((touch.clientX - rect.left) / rect.width) * VIEW_WIDTH;
                        const index = Math.round(((x - PADDING) / (VIEW_WIDTH - 2 * PADDING)) * (history.length - 1));
                        if (index >= 0 && index < history.length) {
                            setHoveredPoint(history[index]);
                            const pointX = (index / (history.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
                            setMousePos({ x: pointX, y: 0 });
                        }
                    }}
                    onTouchEnd={() => setHoveredPoint(null)}
                >
                    <defs>
                        <linearGradient id={`grad-chart`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <line
                            key={i}
                            x1={PADDING}
                            y1={PADDING + p * (VIEW_HEIGHT - 2 * PADDING)}
                            x2={VIEW_WIDTH - PADDING}
                            y2={PADDING + p * (VIEW_HEIGHT - 2 * PADDING)}
                            stroke="#EEF2FF"
                            strokeWidth="1"
                        />
                    ))}

                    <path
                        d={`M ${PADDING},${VIEW_HEIGHT} L ${points} L ${VIEW_WIDTH - PADDING},${VIEW_HEIGHT} Z`}
                        fill={`url(#grad-chart)`}
                    />

                    <polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {hoveredPoint && (
                        <>
                            <line
                                x1={mousePos.x}
                                y1={PADDING}
                                x2={mousePos.x}
                                y2={VIEW_HEIGHT - PADDING}
                                stroke={color}
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <circle
                                cx={mousePos.x}
                                cy={VIEW_HEIGHT - PADDING - ((hoveredPoint.price - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                                r="6"
                                fill={color}
                                stroke="white"
                                strokeWidth="3"
                            />
                        </>
                    )}
                </svg>
            </div>

            <div className="flex justify-between mt-4 px-2">
                <span className="text-[10px] font-black text-indigo-900/20 uppercase tracking-widest">{history[0]?.date}</span>
                <span className="text-[10px] font-black text-indigo-900/20 uppercase tracking-widest">{history[history.length - 1]?.date}</span>
            </div>
        </div>
    );
};

export default PriceHistoryChart;
