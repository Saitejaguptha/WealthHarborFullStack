import React, { useEffect } from 'react';
import { FiBell, FiTrash2, FiClock } from 'react-icons/fi';
import { useAuth } from '../../features/auth/authHooks';
import PageHeader from '../../components/common/PageHeader';

const Notifications: React.FC = () => {
    const { user, notifications, fetchNotifications, deleteNotification } = useAuth();

    useEffect(() => {
        if (user?.user_uuid) {
            fetchNotifications();
        }
    }, [user?.user_uuid, fetchNotifications]);

    const handleDelete = (id: number) => {
        deleteNotification(id);
    };

    return (
        <div className="p-4 md:p-8 w-full animate-in fade-in duration-700">
            <PageHeader
                title="Notifications"
                description="Stay updated with your latest activities and alerts"
                onRefresh={fetchNotifications}
                refreshLabel="Refresh Alerts"
            />

            <div className="space-y-4">
                {notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className="p-6 rounded-[2rem] border bg-white border-white shadow-xl shadow-indigo-100/30 transition-all flex gap-4 animate-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-base leading-relaxed text-indigo-950 font-bold">
                                        {notif.not_description}
                                    </p>
                                    <button 
                                        onClick={() => handleDelete(notif.id)}
                                        className="p-2 text-indigo-300 hover:text-rose-500 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
                                    <FiClock />
                                    <span>{new Date(notif.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 text-center bg-white/30 backdrop-blur-sm rounded-[3rem] border border-white/50">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBell size={48} />
                        </div>
                        <h3 className="text-xl font-black text-indigo-950/40 uppercase tracking-widest">Inbox Zero</h3>
                        <p className="text-indigo-900/30 font-medium mt-2">You don't have any notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
