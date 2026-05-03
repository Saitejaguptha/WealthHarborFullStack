import React, { useState } from 'react';
import { FiFileText, FiLink, FiMic, FiBookOpen, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Props {
    annualReportUrl: string;
    investorPresentationUrl: string;
    earningsReleaseUrl: string;
    conferenceCallUrl: string;
    conferenceCallSummary: string;
    companyName: string;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h2 className="text-lg md:text-2xl font-black text-indigo-950 mb-4 md:mb-6 tracking-tight flex items-center gap-2 md:gap-3">
        <span className="text-indigo-400 text-xl md:text-2xl shrink-0">{icon}</span>
        <span className="break-words line-clamp-2">{title}</span>
        <div className="h-0.5 md:h-1 flex-1 bg-indigo-50 rounded-full min-w-[20px]" />
    </h2>
);

const DocCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; url: string; color: string }> = ({ icon, title, subtitle, url, color }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-indigo-50 shadow-lg shadow-indigo-50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-sm font-black text-indigo-950 mb-0.5">{title}</p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{subtitle}</p>
        </div>
        <FiLink className="ml-auto text-indigo-300 group-hover:text-indigo-600 transition-colors shrink-0" />
    </a>
);

const DocumentsSection: React.FC<Props> = ({
    annualReportUrl, investorPresentationUrl, earningsReleaseUrl,
    conferenceCallUrl, conferenceCallSummary, companyName
}) => {
    const [expanded, setExpanded] = useState(false);

    const docs = [
        { icon: <FiBookOpen />, title: 'Annual Report', subtitle: 'FY 2024 PDF', url: annualReportUrl, color: 'bg-indigo-600' },
        { icon: <FiFileText />, title: 'Investor Deck', subtitle: 'Presentation', url: investorPresentationUrl, color: 'bg-violet-600' },
        { icon: <FiFileText />, title: 'Earnings', subtitle: 'Q4 FY24 Results', url: earningsReleaseUrl, color: 'bg-emerald-600' },
        { icon: <FiMic />, title: 'Call Record', subtitle: 'Q4 FY24', url: conferenceCallUrl, color: 'bg-amber-500' },
    ];

    return (
        <div className="mb-8 md:mb-12">
            <SectionTitle icon={<FiFileText />} title="Investor Documents" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {docs.map((d, i) => <DocCard key={i} {...d} />)}
            </div>

            {/* Conference Call Summary */}
            <div className="bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-50 overflow-hidden">
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-indigo-50/30 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <FiMic className="text-sm" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-indigo-950">Conference Call Summary</p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Q4 FY24 Earnings Call · {companyName}</p>
                        </div>
                    </div>
                    {expanded ? <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />}
                </button>
                {expanded && (
                    <div className="px-6 pb-6 border-t border-indigo-50">
                        <p className="text-sm text-indigo-900/70 leading-relaxed mt-4 font-medium">{conferenceCallSummary}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsSection;
