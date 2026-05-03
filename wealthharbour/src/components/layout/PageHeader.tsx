import React from 'react';
import BeginnerGuide from '../common/BeginnerGuide';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    guide?: {
        title: string;
        description: string;
        steps: any[];
    };
    guideColor?: 'indigo' | 'rose' | 'emerald' | 'amber';
    children?: React.ReactNode; // For extra actions like search buttons
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    subtitle, 
    icon, 
    guide, 
    guideColor = 'indigo',
    children 
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-indigo-50 pb-8 mb-8">
            <div className="flex-1">
                <h1 className="text-3xl font-black text-indigo-950 flex items-center gap-3">
                    <span className="flex-shrink-0">{icon}</span>
                    <span>{title}</span>
                </h1>
                <p className="text-indigo-900/50 mt-2 font-medium">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                {children}
                {guide && (
                    <BeginnerGuide 
                        title={guide.title}
                        description={guide.description}
                        steps={guide.steps}
                        color={guideColor}
                    />
                )}
            </div>
        </div>
    );
};

export default PageHeader;
