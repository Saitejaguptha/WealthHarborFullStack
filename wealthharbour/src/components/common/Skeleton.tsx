import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
    className = '', 
    width = '100%', 
    height = '1rem', 
    borderRadius = '0.5rem' 
}) => {
    return (
        <div 
            className={`animate-pulse bg-indigo-50/50 ${className}`}
            style={{ 
                width, 
                height, 
                borderRadius,
                backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'pulse-shimmer 2s infinite linear'
            }}
        />
    );
};

export const CardSkeleton: React.FC = () => (
    <div className="bg-white border border-indigo-50 rounded-[2rem] p-8 space-y-6">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <Skeleton width={60} height={20} />
                <Skeleton width={150} height={28} />
            </div>
            <Skeleton width={80} height={40} />
        </div>
        <div className="space-y-3">
            <Skeleton height={12} />
            <Skeleton height={12} />
            <Skeleton height={12} />
        </div>
        <div className="flex gap-2">
            <Skeleton width={60} height={24} borderRadius={999} />
            <Skeleton width={80} height={24} borderRadius={999} />
        </div>
    </div>
);

export default Skeleton;
