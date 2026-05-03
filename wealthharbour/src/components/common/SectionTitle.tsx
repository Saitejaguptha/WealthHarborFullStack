import React from 'react';

interface SectionTitleProps {
    icon: React.ReactNode;
    title: string;
    className?: string;
}

/**
 * A reusable section header component with an icon, title, and a decorative divider.
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, className = "" }) => (
    <div className={`mb-4 md:mb-6 ${className}`}>
        <h2 className="text-lg md:text-2xl font-black text-indigo-950 tracking-tight flex items-center gap-2 md:gap-3">
            <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
            <span className="truncate min-w-0">{title}</span>
            <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[10px]" />
        </h2>
    </div>
);

export default SectionTitle;
