import React, { useContext } from 'react';
import { ChevronLeft, User, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = ({ title, showBackButton, onBack, showAuthButton = true }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow-md sticky top-0 z-10">
            <div className="flex items-center space-x-2">
                {showBackButton && (
                    <button onClick={onBack} className="p-1 rounded-full hover:bg-indigo-700 transition">
                        <ChevronLeft size={24} />
                    </button>
                )}
                <h1 className="text-xl font-bold">{title}</h1>
            </div>
            {showAuthButton && (
                <div className="flex items-center space-x-3">
                    {user && (
                         <div className="flex items-center space-x-1 text-sm bg-indigo-500 rounded-full py-1 px-3" title={`Phone: ${user.phone}`}>
                            <User size={16} />
                            <span className="font-medium capitalize">{user.role}</span>
                        </div>
                    )}
                    {user ? (
                        <button onClick={logout} className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition" title="Đăng xuất">
                            <LogIn size={20} />
                        </button>
                    ) : (
                        <button onClick={onBack} className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition" title="Đăng nhập">
                            <LogIn size={20} />
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};
export default Header;