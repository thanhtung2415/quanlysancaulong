import React from 'react';
import { CheckCircle, Home, Calendar } from 'lucide-react';

const BookingSuccessScreen = ({ navigateTo }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center bg-white rounded-xl shadow-lg mt-4 animate-fade-in">
            {/* Icon Thành công lớn */}
            <div className="mb-6 transform transition hover:scale-110 duration-300">
                <CheckCircle size={80} className="text-green-500 mx-auto drop-shadow-lg" />
            </div>

            <h2 className="text-3xl font-bold text-green-600 mb-2">Đặt Sân Thành Công!</h2>
            <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                Cảm ơn bạn đã đặt sân. Hệ thống đã ghi nhận lịch của bạn. Vui lòng đến sân đúng giờ nhé!
            </p>

            {/* Các nút điều hướng */}
            <div className="w-full space-y-3">
                <button 
                    onClick={() => navigateTo('home')}
                    className="w-full py-3 bg-green-500 text-white font-bold text-lg rounded-xl shadow-md hover:bg-green-600 transition flex items-center justify-center"
                >
                    <Home size={20} className="mr-2" /> Quay Về Trang Chủ
                </button>
                
                <button 
                    onClick={() => navigateTo('myBookings')}
                    className="w-full py-3 bg-white text-green-600 font-bold text-lg rounded-xl border-2 border-green-500 hover:bg-green-50 transition flex items-center justify-center"
                >
                    <Calendar size={20} className="mr-2" /> Xem Lịch Đã Đặt
                </button>
            </div>
        </div>
    );
};

export default BookingSuccessScreen;