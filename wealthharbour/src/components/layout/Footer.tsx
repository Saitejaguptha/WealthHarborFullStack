import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiGlobe, FiFileText, FiBell, FiCalendar } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    const links = [
        { to: '/market-summary',  Icon: FiActivity, label: 'Overview' },
        { to: '/market-analysis', Icon: FiGlobe,    label: 'Analysis' },
        { to: '/stocks-in-news',  Icon: FiFileText, label: 'News'     },
        { to: '/notifications',   Icon: FiBell,     label: 'Alerts'   },
        { to: '/updates',         Icon: FiCalendar, label: 'Events'   },
    ];

    return (
        <footer className={styles.footer}>
            {links.map(({ to, Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                >
                    <Icon className={styles.navIcon} aria-hidden="true" />
                    <span className={styles.navLabel}>{label}</span>
                </NavLink>
            ))}
        </footer>
    );
};

export default Footer;
