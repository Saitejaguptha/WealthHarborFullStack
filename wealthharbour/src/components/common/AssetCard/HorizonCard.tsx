import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';
import { formatNumberEnIn } from '../../../utils/numberFormat';
import styles from './HorizonCard.module.css';
import toast from 'react-hot-toast';

export interface HorizonData {
    risk: 'R' | 'Y' | 'G';
    expectedReturn: string;
    taxation: string;
}

interface HorizonCardProps {
    symbol?: string;
    name: string;
    price: number;
    change: number;
    isPositive: boolean;
    shortTerm: HorizonData;
    midTerm: HorizonData;
    longTerm: HorizonData;
    tags: string[];
}

const HorizonCard: React.FC<HorizonCardProps> = ({
    symbol,
    name,
    price,
    change,
    isPositive,
    shortTerm,
    midTerm,
    longTerm,
    tags
}) => {
    const handleTaxInfo = (info: string) => {
        toast(info, {
            icon: '💰',
            style: {
                borderRadius: '12px',
                background: '#1e1b4b',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
            },
        });
    };

    const renderHorizonRow = (label: string, data: HorizonData) => (
        <div className={styles.matrixRow}>
            <div className={styles.horizonInfo}>
                <div className={`${styles.riskDot} ${styles[`risk${data.risk}`]}`} />
                <span className={styles.horizonLabel}>{label}</span>
            </div>
            <div className={styles.returnValue}>
                {data.expectedReturn}
                <FiInfo 
                    className={styles.infoIcon} 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTaxInfo(data.taxation);
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    {symbol && <span className={styles.symbol}>{symbol}</span>}
                    <h3 className={styles.name}>{name}</h3>
                </div>
                <div className={styles.priceGroup}>
                    <span className={styles.price}>₹{formatNumberEnIn(price)}</span>
                    <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                        <span>{isPositive ? '+' : ''}{change}%</span>
                    </div>
                </div>
            </div>

            <div className={styles.matrix}>
                {renderHorizonRow('Short Term', shortTerm)}
                {renderHorizonRow('Mid Term', midTerm)}
                {renderHorizonRow('Long Term', longTerm)}
            </div>

            <div className={styles.footer}>
                {tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default HorizonCard;
