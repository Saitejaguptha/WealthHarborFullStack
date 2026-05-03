import React, { useState } from 'react';
import { FiPieChart } from 'react-icons/fi';
import { formatNumberEnIn } from '../../utils/numberFormat';
import type { RevenueMixItem } from '../../types/stock';

interface Props {
    revenueMix: RevenueMixItem[];
    locationBreakup: RevenueMixItem[];
    productBreakup: RevenueMixItem[];
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-4 md:mb-6 tracking-tight flex items-center gap-2 md:gap-3">
        <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
        <span className="break-words line-clamp-2">{title}</span>
        <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
    </h2>
);

const DonutChart: React.FC<{ items: RevenueMixItem[]; title: string }> = ({ items, title }) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const SIZE = 180;
    const CX = SIZE / 2, CY = SIZE / 2;
    const R = 65, IR = 40;

    let cumAngle = -Math.PI / 2;
    const slices = items.map((item, i) => {
        const angle = (item.value / 100) * 2 * Math.PI;
        const x1 = CX + R * Math.cos(cumAngle);
        const y1 = CY + R * Math.sin(cumAngle);
        const nextAngle = cumAngle + angle;
        const x2 = CX + R * Math.cos(nextAngle);
        const y2 = CY + R * Math.sin(nextAngle);
        const ix1 = CX + IR * Math.cos(cumAngle);
        const iy1 = CY + IR * Math.sin(cumAngle);
        const ix2 = CX + IR * Math.cos(nextAngle);
        const iy2 = CY + IR * Math.sin(nextAngle);
        const large = angle > Math.PI ? 1 : 0;
        const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${IR} ${IR} 0 ${large} 0 ${ix1} ${iy1} Z`;
        const slice = { path, color: item.color, label: item.label, value: item.value, index: i };
        cumAngle = nextAngle;
        return slice;
    });

    const activeItem = hovered !== null ? items[hovered] : null;

    return (
        <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">{title}</p>
            <div className="relative scale-90 sm:scale-100 transition-transform">
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                    {slices.map((s) => (
                        <path
                            key={s.index}
                            d={s.path}
                            fill={s.color}
                            opacity={hovered === null || hovered === s.index ? 1 : 0.4}
                            className="transition-opacity duration-200 cursor-pointer"
                            onMouseEnter={() => setHovered(s.index)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
                    <text x={CX} y={CY - 6} textAnchor="middle" className="text-xs" fill="#1e1b4b" fontSize="13" fontWeight="800">
                        {activeItem ? `${activeItem.value}%` : '100%'}
                    </text>
                    <text x={CX} y={CY + 10} textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="700">
                        {activeItem ? activeItem.label.toUpperCase() : 'TOTAL'}
                    </text>
                </svg>
            </div>
            <div className="mt-3 w-full space-y-1.5">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs cursor-pointer"
                        onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className={`font-semibold ${hovered === i ? 'text-indigo-700' : 'text-indigo-900/70'}`}>{item.label}</span>
                        </div>
                        <span className="font-black text-indigo-950">{formatNumberEnIn(item.value)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarBreakup: React.FC<{ items: RevenueMixItem[]; title: string }> = ({ items, title }) => (
    <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">{title}</p>
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-bold text-indigo-900/70">{item.label}</span>
                        </div>
                        <span className="text-xs font-black text-indigo-950">{formatNumberEnIn(item.value)}%</span>
                    </div>
                    <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RevenueMixSection: React.FC<Props> = ({ revenueMix, locationBreakup, productBreakup }) => (
    <div className="mb-8 md:mb-12">
        <SectionTitle icon={<FiPieChart />} title="Revenue Mix" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-6">
                <DonutChart items={revenueMix} title="Revenue Split" />
            </div>
            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-6">
                <BarBreakup items={locationBreakup} title="Location Wise Break-Up" />
            </div>
            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 p-6">
                <BarBreakup items={productBreakup} title="Product Wise Break-Up" />
            </div>
        </div>
    </div>
);

export default RevenueMixSection;
