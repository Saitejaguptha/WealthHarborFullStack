import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiInfo, FiLogOut, FiSearch, FiStar } from 'react-icons/fi';
import { useAuth } from '../../features/auth/authHooks';
import GlobalSearch from '../common/GlobalSearch/GlobalSearch';
import styles from './Header.module.css';


interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            {/* Left — hamburger + logo */}
            <div className={styles.leftGroup}>
                <button
                    onClick={onMenuClick}
                    className={styles.menuBtn}
                    aria-label="Open navigation menu"
                >
                    <FiMenu className="h-6 w-6" aria-hidden="true" />
                </button>
                <Link to="/" className={styles.logoLink}>
                    WealthHarbor
                </Link>
            </div>

            {/* Center — Global Search */}
            <div className={styles.center}>
                <GlobalSearch />
            </div>


            {/* Right — actions */}
            <div className={styles.rightGroup}>
                <NavLink
                    to="/watchlist"
                    className={({ isActive }) =>
                        `${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`
                    }
                    aria-label="Watchlist"
                >
                    <FiStar className="h-5 w-5" aria-hidden="true" />
                    <span className={styles.navBtnLabel}>Watchlist</span>
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`
                    }
                    aria-label="About"
                >
                    <FiInfo className="h-5 w-5" aria-hidden="true" />
                    <span className={styles.navBtnLabel}>About</span>
                </NavLink>

                <NavLink to="/profile" className={styles.avatarWrap} aria-label="Profile">
                    <div className={styles.avatar}>
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Lucky'}`}
                            alt=""
                            className={styles.avatarImg}
                        />
                    </div>
                    <span className={styles.avatarLabel}>Profile</span>
                </NavLink>

                <button
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                    aria-label="Sign out"
                >
                    <FiLogOut className="h-5 w-5" aria-hidden="true" />
                    <span className={styles.logoutLabel}>Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
