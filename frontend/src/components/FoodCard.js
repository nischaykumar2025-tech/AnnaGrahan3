"use client";
import { useState } from 'react';

export default function FoodCard({ post, onClaimed }) {
    const [claiming, setClaiming] = useState(false);

    const handleClaim = async () => {
        // Prevent double-clicks or claiming already claimed items
        if (post.status !== 'AVAILABLE') return;
        
        setClaiming(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://annagrahan.vercel.app';
            
            // Hit the claim endpoint we established in the backend
            const res = await fetch(`${apiUrl}/api/food/${post.id}/claim`, {
                method: 'POST',
            });
            
            if (res.ok) {
                // Instantly refresh the homepage feed
                if (onClaimed) onClaimed();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to claim food. It may have already been claimed.');
            }
        } catch (error) {
            console.error('Error claiming food:', error);
            alert('A network error occurred while claiming.');
        } finally {
            setClaiming(false);
        }
    };

    const isAvailable = post.status === 'AVAILABLE';

    return (
        <div 
            className="bg-white p-8 rounded-[2rem] shadow-classic-card border-t-8 flex flex-col justify-between h-full" 
            style={{ borderColor: 'rgb(125, 156, 101)' }}
        >
            <div>
                <h3 className="font-classic text-2xl font-bold mb-6 leading-tight" style={{ color: 'rgb(185, 54, 54)' }}>
                    {post.title}
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: 'rgb(255, 242, 160)' }}>
                        🏪
                    </div>
                    <span className="font-medium text-gray-700 text-lg">{post.eatery_name}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: 'rgb(255, 242, 160)' }}>
                        📦
                    </div>
                    <span className="font-medium text-gray-700 text-lg">{post.quantity}</span>
                </div>
            </div>

            {/* Interactive Claim Button */}
            <button 
                onClick={handleClaim}
                disabled={!isAvailable || claiming}
                className={`w-full py-4 rounded-xl font-bold tracking-wider transition-all duration-200 uppercase ${
                    isAvailable 
                        ? 'cursor-pointer active:scale-95 hover:opacity-90' 
                        : 'cursor-not-allowed opacity-50'
                }`}
                style={{ 
                    backgroundColor: isAvailable ? 'rgb(255, 242, 160)' : '#e5e7eb', 
                    color: isAvailable ? 'rgb(185, 54, 54)' : '#6b7280',
                    boxShadow: isAvailable ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
                }}
            >
                {claiming ? 'Claiming...' : isAvailable ? 'Claim Food' : 'Claimed'}
            </button>
        </div>
    );
}