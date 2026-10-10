"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FoodCard from '@/components/FoodCard';

export default function Home() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            // Dynamically uses your deployed Vercel backend URL, or localhost if testing locally
           const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://annagrahan.vercel.app';
            const res = await fetch(`${apiUrl}/api/food`);
            
            if (!res.ok) {
                throw new Error(`Server returned status ${res.status}`);
            }
            const data = await res.json();
            setFoods(data);
        } catch (error) {
            console.error('Error fetching foods:', error);
            setFoods([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <main className="min-h-screen">
            <header 
                className="border-b shadow-classic sticky top-0 z-50 backdrop-blur-md"
                style={{ 
                    backgroundColor: 'rgba(255, 242, 160, 0.95)', 
                    borderColor: 'rgba(125, 156, 101, 0.3)' 
                }}
            >
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-green-soft font-bold text-white transition-transform group-hover:scale-105"
                            style={{ backgroundColor: 'rgb(125, 156, 101)' }}
                        >
                            🌾
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight leading-none" style={{ color: 'rgb(125, 156, 101)' }}>
                                Anna Grahan
                            </h1>
                            <p className="text-xs font-medium mt-0.5" style={{ color: 'rgb(185, 54, 54)' }}>
                                Neighborhood Surplus Food Expiry Board
                            </p>
                        </div>
                    </Link>

                    <Link 
                        href="/post-food" 
                        className="px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-btn-orange"
                        style={{ backgroundColor: 'rgb(255, 156, 76)' }}
                    >
                        + Post Surplus
                    </Link>
                </div>
            </header>

            <section 
                className="relative overflow-hidden rounded-b-[4rem] px-6 py-16 lg:py-24 shadow-classic-card"
                style={{ backgroundColor: 'rgb(125, 156, 101)' }}
            >
                <div 
                    className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full opacity-20 blur-3xl animate-hero-float"
                    style={{ backgroundColor: 'rgb(255, 242, 160)' }}
                ></div>
                <div 
                    className="absolute bottom-[-100px] right-[-50px] w-96 h-96 rounded-full opacity-30 blur-3xl animate-hero-float"
                    style={{ backgroundColor: 'rgb(255, 156, 76)', animationDelay: '2s' }}
                ></div>

                <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-left max-w-2xl animate-slide-up">
                        <div 
                            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6 shadow-btn-orange"
                            style={{ backgroundColor: 'rgb(255, 156, 76)', color: 'white' }}
                        >
                            The Local Eatery Surplus Portal
                        </div>
                        <h2 className="font-classic text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: 'rgb(255, 242, 160)' }}>
                            Connect your surplus to the community.
                        </h2>
                        <p className="text-lg md:text-xl font-medium mb-10 leading-relaxed" style={{ color: 'rgba(255, 242, 160, 0.9)' }}>
                            A dedicated platform for restaurants, cafes, and catering services to list surplus food with real-time quantity tracking, dietary tags, and safe-consumption expiry limits.
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                href="/post-food" 
                                className="px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-btn-orange text-lg"
                                style={{ backgroundColor: 'rgb(255, 156, 76)' }}
                            >
                                Post Surplus
                            </Link>
                            <a 
                                href="#listings"
                                className="px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 text-lg"
                                style={{ backgroundColor: 'rgba(255, 242, 160, 0.15)', color: 'rgb(255, 242, 160)', border: '2px solid rgb(255, 242, 160)' }}
                            >
                                View Listings
                            </a>
                        </div>
                    </div>

                    <div className="hidden md:flex animate-slide-up delay-200 justify-center items-center">
                        <div 
                            className="w-64 h-64 rounded-full flex items-center justify-center flex-col shadow-classic-card border-8"
                            style={{ backgroundColor: 'rgb(255, 242, 160)', borderColor: 'rgb(125, 156, 101)' }}
                        >
                            <span className="text-6xl mb-2">🍲</span>
                            <span className="font-classic font-bold text-2xl text-center" style={{ color: 'rgb(185, 54, 54)' }}>
                                Safe &<br/>Sustainable
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto -mt-8 relative z-10 grid grid-cols-3 gap-4 px-6 animate-slide-up delay-200">
                {[
                    { label: 'Partner Eateries', value: '24', color: 'rgb(125, 156, 101)' },
                    { label: 'Meals Rescued', value: '1,200+', color: 'rgb(255, 156, 76)' },
                    { label: 'Active Consumers', value: '450', color: 'rgb(185, 54, 54)' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-classic-card border border-amber-50">
                        <div className="font-classic text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            <section id="listings" className="max-w-5xl mx-auto px-6 py-24">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="font-classic text-4xl font-bold mb-4" style={{ color: 'rgb(125, 156, 101)' }}>
                        Live Community Surplus
                    </h2>
                    <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'rgb(255, 156, 76)' }}></div>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-bold text-xl animate-pulse" style={{ color: 'rgb(125, 156, 101)' }}>
                        Loading active listings...
                    </div>
                ) : foods.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl text-center shadow-classic-card border-t-4" style={{ borderColor: 'rgb(125, 156, 101)' }}>
                        <span className="text-5xl block mb-4">🍽️</span>
                        <h3 className="font-classic text-2xl font-bold mb-2" style={{ color: 'rgb(185, 54, 54)' }}>No Active Listings</h3>
                        <p className="text-lg text-gray-600">Our partner eateries have no surplus posted at this exact moment. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {foods.map((food, idx) => (
                            <div key={food.id} className="animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                                <FoodCard post={food} onClaimed={fetchFoods} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <footer className="py-12 text-center" style={{ backgroundColor: 'rgb(125, 156, 101)', color: 'rgb(255, 242, 160)' }}>
                <h2 className="font-classic text-2xl font-bold mb-2">Anna Grahan</h2>
                <p className="opacity-80 text-sm">Connecting neighborhood eateries with the community, one meal at a time.</p>
            </footer>
        </main>
    );
}