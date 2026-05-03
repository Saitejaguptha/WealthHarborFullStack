import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
    onRefresh?: () => void;
    refreshLabel?: string;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    description, 
    onRefresh, 
    refreshLabel = "Refresh",
    children 
}) => {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1 w-full">
                    <h1 className="text-3xl md:text-4xl font-black text-indigo-950 mb-2 tracking-tight flex items-center gap-3">
                        {title}
                    </h1>
                    <p className="text-sm md:text-base text-indigo-900/60 font-medium">{description}</p>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-50 text-indigo-600 font-bold rounded-2xl hover:border-indigo-500 hover:text-indigo-800 transition-all active:scale-95 shadow-sm hover:shadow-md"
                    >
                        {refreshLabel}
                    </button>
                )}
            </div>
            {children && <div className="mb-8">{children}</div>}
        </div>
    );
};

export default PageHeader;
