import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginScreen = ({ onLoginSuccess }) => {
    // Chỉ lấy login, loading, error từ Context (Không lấy setError vì Context chưa export)
    const { login, loading, error } = useContext(AuthContext); 
    const [username, setUsername] = useState('user1', 'staff');
    const [password, setPassword] = useState('123');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            alert('Đăng ký thành công! (Mock)');
            setIsRegister(false);
            return;
        }
        
        const success = await login(username, password);
        if (success) onLoginSuccess();
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* 1. PHẦN ẢNH BÊN TRÁI */}
            <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=1920&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-green-900/60 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-5xl font-bold mb-6">Badminton Booking</h1>
                    <p className="text-xl opacity-90">Đặt sân nhanh chóng, thi đấu đỉnh cao. Kết nối đam mê cầu lông của bạn ngay hôm nay.</p>
                </div>
            </div>

            {/* 2. PHẦN FORM BÊN PHẢI */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {isRegister ? 'Tạo Tài Khoản' : 'Chào Mừng Trở Lại'}
                        </h2>
                        <p className="text-gray-500">Vui lòng nhập thông tin để tiếp tục</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="user1"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            {loading ? 'Đang xử lý...' : (
                                <>
                                    {isRegister ? 'Đăng Ký' : 'Đăng Nhập'} <ArrowRight size={20} className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                            <button 
                                // ĐÃ SỬA DÒNG NÀY (Xóa setError(null) đi)
                                onClick={() => setIsRegister(!isRegister)}
                                className="ml-2 text-green-600 font-bold hover:underline"
                            >
                                {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;