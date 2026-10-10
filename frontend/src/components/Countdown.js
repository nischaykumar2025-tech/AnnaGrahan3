"use client";
import { useState, useEffect } from 'react';

export default function Countdown({ expiresAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expirationTime = new Date(expiresAt).getTime();
            const distance = expirationTime - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft('Expired');
                if (onExpire) onExpire();
            } else {
                const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
                const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                const timeParts = [];
                if (months > 0) timeParts.push(`${months}mo`);
                if (days > 0) timeParts.push(`${days}d`);
                if (hours > 0) timeParts.push(`${hours}h`);
                if (minutes > 0) timeParts.push(`${minutes}m`);

                setTimeLeft(timeParts.length > 0 ? timeParts.join(' ') : '< 1m');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    return (
        <span 
            className="font-mono font-bold px-2.5 py-1 rounded-md text-xs tracking-wider inline-block animate-pulse-subtle"
            style={{ 
                backgroundColor: 'rgb(255, 242, 160)', 
                color: 'rgb(185, 54, 54)',
                border: '1px solid rgba(185, 54, 54, 0.2)'
            }}
        >
            ⏳ {timeLeft}
        </span>
    );
}