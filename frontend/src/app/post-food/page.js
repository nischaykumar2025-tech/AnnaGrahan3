"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostFood() {
    const router = useRouter();
    const [form, setForm] = useState({
        eatery_name: '', title: '', dietary: '', quantity: '', expires_at: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Safely combine dietary tag with title for the current backend schema
        const finalTitle = form.dietary ? `[${form.dietary}] ${form.title}` : form.title;
        
        const payload = {
            eatery_name: form.eatery_name,
            title: finalTitle,
            quantity: form.quantity,
            expires_at: form.expires_at
        };

        const res = await fetch('http://localhost:5000/api/food', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) router.push('/');
    };

    return (
        <main className="min-h-screen py-20 px-6 relative flex items-center justify-center">
            <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: 'rgb(125, 156, 101)' }}></div>
            
            <div className="relative max-w-xl w-full bg-white p-10 md:p-14 rounded-[3rem] shadow-classic-card border-t-8 animate-slide-up" style={{ borderColor: 'rgb(125, 156, 101)' }}>
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-classic text-4xl font-bold" style={{ color: 'rgb(185, 54, 54)' }}>
                            Post Eatery Surplus
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">Log quantity, dietary tags, and safe expiry.</p>
                    </div>
                    <Link href="/" className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)' }}>
                        ✕
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(125, 156, 101)' }}>
                            Eatery Name
                        </label>
                        <input 
                            type="text" required 
                            className="w-full rounded-2xl p-4 font-medium transition-all focus:outline-none focus:ring-4"
                            style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)', outlineColor: 'transparent', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                            placeholder="e.g. Green Leaf Cafe"
                            onChange={(e) => setForm({...form, eatery_name: e.target.value})} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(125, 156, 101)' }}>
                                Food Description
                            </label>
                            <input 
                                type="text" required 
                                className="w-full rounded-2xl p-4 font-medium transition-all focus:outline-none focus:ring-4"
                                style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)', outlineColor: 'transparent', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                placeholder="e.g. Vegetable Biryani"
                                onChange={(e) => setForm({...form, title: e.target.value})} 
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(125, 156, 101)' }}>
                                Dietary Tag
                            </label>
                            <select 
                                required
                                className="w-full rounded-2xl p-4 font-medium transition-all focus:outline-none focus:ring-4 appearance-none"
                                style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)', outlineColor: 'transparent', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                onChange={(e) => setForm({...form, dietary: e.target.value})}
                            >
                                <option value="">Select Category...</option>
                                <option value="Veg">Vegetarian</option>
                                <option value="Non-Veg">Non-Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Contains Nuts">Contains Nuts</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(125, 156, 101)' }}>
                            Quantity / Servings
                        </label>
                        <input 
                            type="text" required 
                            className="w-full rounded-2xl p-4 font-medium transition-all focus:outline-none focus:ring-4"
                            style={{ backgroundColor: 'rgb(255, 242, 160)', color: 'rgb(185, 54, 54)', outlineColor: 'transparent', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                            placeholder="e.g. 15 Meals"
                            onChange={(e) => setForm({...form, quantity: e.target.value})} 
                        />
                    </div>

                    {/* Animated Calendar Input with New Sapphire/Gold Palette */}
                    <div className="pt-2">
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1E3A8A' }}>
                            Safe-Consumption Expiry Time
                        </label>
                        <input 
                            type="datetime-local" required 
                            className="w-full rounded-2xl p-4 font-bold text-lg calendar-input-animated shadow-md"
                            onChange={(e) => setForm({...form, expires_at: e.target.value})} 
                        />
                        <p className="text-xs font-semibold mt-2" style={{ color: '#B45309' }}>
                            * After this time, the listing is automatically removed to ensure food safety.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-5 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform active:scale-95 shadow-btn-green mt-8"
                        style={{ backgroundColor: 'rgb(125, 156, 101)' }}
                    >
                        Publish to Surplus Portal
                    </button>
                </form>
            </div>
        </main>
    );
}