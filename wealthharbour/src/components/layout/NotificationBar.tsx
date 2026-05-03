import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../../features/auth/authHooks';

const NotificationBar: React.FC = () => {
    const { user, notifications, fetchNotifications } = useAuth();
    
    useEffect(() => {
        if (user?.user_uuid) {
            fetchNotifications();
        }
    }, [user?.user_uuid]);

    // For now, we show the badge if there are any notifications.
    // In a full implementation, you'd add a 'read' status to the backend table.
    const hasNotifications = notifications && notifications.length > 0;

    return (
        <NavLink
            to="/notifications"
            className={({ isActive }) =>
                `p-2 rounded-xl transition-all relative ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'}`
            }
            title="Notifications"
        >
            <FiBell className="h-5 w-5 md:h-6 md:w-6" />
            {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
                </span>
            )}
        </NavLink>
    );
};

export default NotificationBar;
