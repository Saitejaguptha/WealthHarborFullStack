import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiGlobe, FiFileText, FiBell, FiCalendar } from 'react-icons/fi';
import styles from './Footer.module.css';

const BottomNav: React.FC = () => {
    const navItems = [
        { to: '/market-summary',  Icon: FiActivity, label: 'Overview', isCenter: false },
        { to: '/market-analysis', Icon: FiGlobe,    label: 'Market',   isCenter: false },
        { to: '/stocks-in-news',  Icon: FiFileText, label: 'News',     isCenter: true  },
        { to: '/notifications',   Icon: FiBell,     label: 'Alerts',   isCenter: false },
        { to: '/updates',         Icon: FiCalendar, label: 'Updates',  isCenter: false },
    ];

    return (
        <nav className={styles.bottomNav} aria-label="Main navigation">
            {navItems.map(({ to, Icon, label, isCenter }) => (
                <NavLink
                    key={to}
                    to={to}
                    aria-label={label}
                    className={({ isActive }) => {
                        if (isCenter) {
                            return `${styles.bottomItemCenter} ${isActive ? styles.bottomItemCenterActive : ''}`;
                        }
                        return `${styles.bottomItem} ${isActive ? styles.bottomItemActive : ''}`;
                    }}
                >
                    <Icon className={styles.bottomIcon} aria-hidden="true" />
                    {isCenter
                        ? <span className={styles.bottomCenterLabel}>{label}</span>
                        : <span className={styles.bottomLabel}>{label}</span>
                    }
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
