import React from 'react';
import { FiInfo, FiLayers, FiShield, FiTarget, FiZap, FiBox, FiActivity } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';

const About: React.FC = () => {
    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="About WealthHarbour"
                subtitle="Professional-grade market intelligence for the modern investor."
                icon={<FiInfo className="text-indigo-600" />}
            />

            <div className="mt-12 space-y-12">
                {/* Mission Section */}
                <div className="bg-indigo-950 p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-indigo-400">
                                <FiTarget size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/60 text-left">Our Core Philosophy</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight text-left">Empowering individual sovereignty through intelligence.</h2>
                        <p className="text-indigo-200/70 text-xl font-medium leading-relaxed text-left">
                            WealthHarbour is engineered to bridge the information gap between institutional entities and individual investors. 
                            We provide the high-fidelity tools, real-time data, and structural analysis required to navigate modern financial complexities with confidence.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
                    <div className="bg-white border border-indigo-50 p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                        <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FiLayers size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950 tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">Multi-Asset Synchronicity</h3>
                        <p className="text-indigo-900/50 text-lg font-medium leading-relaxed">
                            Monitor Stocks, Mutual Funds, ETFs, and Commodities within a unified, high-frequency dashboard environment.
                        </p>
                    </div>

                    <div className="bg-white border border-indigo-50 p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                        <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FiShield size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950 tracking-tighter mb-4 group-hover:text-emerald-600 transition-colors">Architectural Integrity</h3>
                        <p className="text-indigo-900/50 text-lg font-medium leading-relaxed">
                            Your financial footprint is secured with military-grade encryption and a commitment to absolute data privacy.
                        </p>
                    </div>
                </div>

                {/* Ecosystem Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-indigo-50">
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic mb-8 text-left">The WealthHarbour Ecosystem</h2>
                        <p className="text-indigo-900/60 text-lg font-medium leading-relaxed text-left">
                            Beyond simple tracking, WealthHarbour offers a comprehensive analysis of the Indian financial landscape. 
                            From NSE/BSE indices and sectoral rotation to deep institutional FII/DII mapping, our platform is designed to be the single source of truth for the sophisticated participant.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                            {[
                                { icon: <FiZap />, label: 'Real-time' },
                                { icon: <FiActivity />, label: 'Analytics' },
                                { icon: <FiBox />, label: 'Unified' },
                                { icon: <FiTarget />, label: 'Precise' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-50">
                                    <div className="text-indigo-600">{item.icon}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-900/40">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-indigo-50/30 p-10 rounded-[3rem] border border-indigo-50 flex flex-col justify-center text-center">
                        <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-2">Build Identifier</p>
                        <h3 className="text-2xl font-black text-indigo-950 tracking-tighter mb-4">Version 1.2.0</h3>
                        <p className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest leading-loose">
                            Stabilized Build • 2024.Q1<br />
                            Engine: WH-Core-Delta<br />
                            Status: Fully Operational
                        </p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default About;

