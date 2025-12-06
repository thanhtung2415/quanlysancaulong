/* --- START OF FILE TopNav.js --- */
import React from 'react';
import { Home, Calendar, User, LogOut } from 'lucide-react';

const TopNav = ({ currentScreen, navigateTo, user, onLogout }) => {
    if (currentScreen === 'login') return null;

    const navItems = [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'myBookings', label: 'Lịch sử', icon: Calendar },
        { id: user?.role === 'admin' ? 'adminDashboard' : 'profile', label: 'Tài khoản', icon: User },
    ];

    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
                {/* Logo */}
                <div 
                    onClick={() => navigateTo('home')}
                    className="flex items-center cursor-pointer gap-2"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold shadow-green-200 shadow-lg">
                        B
                    </div>
                    <span className="font-bold text-gray-800 text-lg tracking-tight">Badminton</span>
                </div>

                {/* Menu */}
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = currentScreen === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(item.id)}
                                className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                                    isActive ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                    
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    <button 
                        onClick={onLogout}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;