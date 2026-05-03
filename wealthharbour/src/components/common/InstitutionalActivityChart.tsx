import React, { useMemo, useState } from 'react';

interface InstitutionalActivityPoint {
    date: string;
    fiiNet: number;
    diiNet: number;
}

interface InstitutionalActivityChartProps {
    data: InstitutionalActivityPoint[];
    height?: number;
    title?: string;
}

const InstitutionalActivityChart: React.FC<InstitutionalActivityChartProps> = ({
    data,
    height = 300,
    title = "Institutional Activity"
}) => {
    // We reverse it because the table shows newest first, but the chart should show chronological
    const chartData = useMemo(() => [...data].reverse(), [data]);

    const fiiValues = chartData.map(d => d.fiiNet);
    const diiValues = chartData.map(d => d.diiNet);
    const allValues = [...fiiValues, ...diiValues];
    
    const min = Math.min(...allValues, 0);
    const max = Math.max(...allValues, 0);
    const range = max - min;
    
    const VIEW_WIDTH = 800;
    const VIEW_HEIGHT = 200;
    const PADDING = 20;

    const [hoveredPoint, setHoveredPoint] = useState<InstitutionalActivityPoint | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const getPoints = (values: number[]) => {
        if (values.length === 0) return "";
        return values.map((v, i) => {
            const x = (i / (values.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
            const y = VIEW_HEIGHT - PADDING - ((v - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING);
            return `${x},${y}`;
        }).join(' ');
    };

    const fiiPoints = useMemo(() => getPoints(fiiValues), [fiiValues, min, range]);
    const diiPoints = useMemo(() => getPoints(diiValues), [diiValues, min, range]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;

        const index = Math.round(((x - PADDING) / (VIEW_WIDTH - 2 * PADDING)) * (chartData.length - 1));
        if (index >= 0 && index < chartData.length) {
            setHoveredPoint(chartData[index]);
            const pointX = (index / (chartData.length - 1)) * (VIEW_WIDTH - 2 * PADDING) + PADDING;
            setMousePos({ x: pointX, y: 0 });
        }
    };

    return (
        <div className="relative w-full bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white shadow-xl shadow-indigo-100/20 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tight">{title}</h3>
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                            <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">FII Net Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">DII Net Activity</span>
                        </div>
                    </div>
                </div>
                {hoveredPoint && (
                    <div className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm min-w-[150px]">
                        <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-1">{hoveredPoint.date}</p>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-indigo-900/60 uppercase">FII:</span>
                            <span className={`text-sm font-black ${hoveredPoint.fiiNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {hoveredPoint.fiiNet > 0 ? '+' : ''}{hoveredPoint.fiiNet} Cr
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-indigo-900/60 uppercase">DII:</span>
                            <span className={`text-sm font-black ${hoveredPoint.diiNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {hoveredPoint.diiNet > 0 ? '+' : ''}{hoveredPoint.diiNet} Cr
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ height: `${height}px` }} className="relative">
                <svg
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                    className="w-full h-full cursor-crosshair"
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    <defs>
                        <linearGradient id="fii-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="dii-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Zero Line */}
                    <line
                        x1={PADDING}
                        y1={VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                        x2={VIEW_WIDTH - PADDING}
                        y2={VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                        stroke="#E0E7FF"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />

                    {/* FII Area and Line */}
                    <path
                        d={`M ${PADDING},${VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)} L ${fiiPoints} L ${VIEW_WIDTH - PADDING},${VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)} Z`}
                        fill="url(#fii-grad)"
                    />
                    <polyline
                        points={fiiPoints}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* DII Area and Line */}
                    <path
                        d={`M ${PADDING},${VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)} L ${diiPoints} L ${VIEW_WIDTH - PADDING},${VIEW_HEIGHT - PADDING - ((0 - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)} Z`}
                        fill="url(#dii-grad)"
                    />
                    <polyline
                        points={diiPoints}
                        fill="none"
                        stroke="#10B981"
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
                                stroke="#CBD5E1"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            {/* FII Point */}
                            <circle
                                cx={mousePos.x}
                                cy={VIEW_HEIGHT - PADDING - ((hoveredPoint.fiiNet - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                                r="4"
                                fill="#4F46E5"
                                stroke="white"
                                strokeWidth="2"
                            />
                            {/* DII Point */}
                            <circle
                                cx={mousePos.x}
                                cy={VIEW_HEIGHT - PADDING - ((hoveredPoint.diiNet - min) / (range || 1)) * (VIEW_HEIGHT - 2 * PADDING)}
                                r="4"
                                fill="#10B981"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </>
                    )}
                </svg>
            </div>

            <div className="flex justify-between mt-6 px-2">
                <span className="text-[10px] font-black text-indigo-900/20 uppercase tracking-widest">{chartData[0]?.date}</span>
                <span className="text-[10px] font-black text-indigo-900/20 uppercase tracking-widest">{chartData[chartData.length - 1]?.date}</span>
            </div>
        </div>
    );
};

export default InstitutionalActivityChart;
