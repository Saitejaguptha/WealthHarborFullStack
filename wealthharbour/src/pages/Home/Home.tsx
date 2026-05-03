import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Sidebar from '../../features/navigation/components/Sidebar';
import ChatBot from '../../components/ChatBot';
import BottomNav from '../../components/layout/BottomNav';
import Footer from '../../components/layout/Footer';
import DisclaimerBar from '../../components/layout/DisclaimerBar';

const Home: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-indigo-50 text-gray-900 font-sans">
                <DisclaimerBar />
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <div className="flex flex-1 min-h-0 overflow-hidden relative mt-[90px]">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-h-0 min-w-0 bg-white relative z-0 w-full max-w-full pb-20 md:pb-[80px] font-sans text-gray-900 antialiased custom-scrollbar">
                        <div className="flex-1 flex flex-col">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <Footer />
                <BottomNav />
                <ChatBot />
            </div>
        );
};

export default Home;

