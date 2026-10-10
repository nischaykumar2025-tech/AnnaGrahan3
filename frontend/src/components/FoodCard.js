"use client";
import { useState } from 'react';
import Countdown from './Countdown';

export default function FoodCard({ post, onClaimed }) {
    const [status, setStatus] = useState(post.status);
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaim = async () => {
        setIsClaiming(true);
        try {
            const res = await fetch(`http://localhost:5000/api/food/${post.id}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consumer_name: 'Local Hero' })
            });
            
            if (res.ok) {
                setStatus('claimed');
                onClaimed();
            }
        } catch (error) {
            console.error('Failed to claim food.');
        }
        setIsClaiming(false);
    };

    return (
        <div className="bg-white rounded-[2rem] overflow-hidden transition-all duration-300 transform hover:-translate-y-2 shadow-classic-card hover:shadow-classic-hover relative group border-2 border-white">
            {/* Top Color Accent Ribbon */}
            <div className="h-3 w-full" style={{ backgroundColor: 'rgb(125, 156, 101)' }}></div>
            
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-classic text-2xl font-bold leading-tight" style={{ color: 'rgb(185, 54, 54)' }}>
                        {post.title}
                    </h3>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(125, 156, 101)' }}>🏪</div>
                        <span className="font-medium text-gray-700">{post.eatery_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(255, 156, 76)' }}>📦</div>
                        <span className="font-medium text-gray-700">{post.quantity}</span>
                    </div>
                </div>

                {status === 'available' ? (
                    <div className="pt-6 border-t-2 border-dashed border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Time Left</span>
                            <Countdown expiresAt={post.expires_at} onExpire={() => setStatus('expired')} />
                        </div>
                        <button 
                            onClick={handleClaim} 
                            disabled={isClaiming}
                            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 active:scale-95 shadow-btn-green flex justify-center items-center gap-2"
                            style={{ backgroundColor: 'rgb(125, 156, 101)' }}
                        >
                            {isClaiming ? 'Reserving...' : 'Claim This Order'} <span>→</span>
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 py-4 text-center rounded-xl font-bold uppercase tracking-widest text-sm"
                        style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)' }}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}