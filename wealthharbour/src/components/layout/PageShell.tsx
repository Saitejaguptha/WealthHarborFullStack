import React from 'react';

export type PageShellMax = '7xl' | '4xl' | 'full';

const maxW: Record<PageShellMax, string> = {
    '7xl': 'max-w-7xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-none',
};

export interface PageShellProps {
    children: React.ReactNode;
    /** Tailwind classes appended after base shell (animations, overflow, extra padding, etc.) */
    className?: string;
    maxWidth?: PageShellMax;
}

/**
 * Routed page wrapper: left-aligned within main (no mx-auto gap beside sidebar),
 * consistent padding and typography with the rest of the app.
 */
const PageShell: React.FC<PageShellProps> = ({ children, className = '', maxWidth = '7xl' }) => (
    <div
        className={`w-full min-w-0 ${maxW[maxWidth]} p-4 md:p-8 font-sans text-gray-900 antialiased ${className}`.trim()}
    >
        {children}
    </div>
);

export default PageShell;
