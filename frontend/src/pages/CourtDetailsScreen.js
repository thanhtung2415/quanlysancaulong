import React from 'react';
import { CheckCircle, MapPin, Clock } from 'lucide-react';
import { MOCK_DB } from '../api/mockApi';

const CourtDetailsScreen = ({ courtId, navigateTo }) => {
    const court = MOCK_DB.courts.find(c => c.id === courtId);

    if (!court) {
        return <div className="p-4 text-center text-red-500">Không tìm thấy thông tin chi tiết sân.</div>;
    }

    const isMaintenance = court.status !== 'available';

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* 1. KHUNG ẢNH & THÔNG TIN CHÍNH */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                {/* Ảnh sân - Có dự phòng nền xám nếu ảnh lỗi */}
                <div className="relative h-56 bg-gray-200">
                    <img 
                        src={court.image} 
                        alt={court.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {e.target.style.display='none'}} // Ẩn ảnh nếu lỗi để hiện nền xám
                    />
                    <div className="absolute top-3 right-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase text-white shadow-sm ${
                            isMaintenance ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                            {isMaintenance ? 'Bảo trì' : 'Đang mở cửa'}
                        </span>
                    </div>
                </div>

                <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{court.name}</h2>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin size={16} className="mr-1 text-green-600" />
                        {court.address}
                    </div>

                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100">
                        <div>
                            <p className="text-xs text-green-700 font-semibold uppercase">Giá thuê</p>
                            <p className="text-xl font-extrabold text-green-700">
                                {court.price.toLocaleString('vi-VN')} đ<span className="text-sm font-normal">/h</span>
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-green-700 font-semibold uppercase">Giờ mở cửa</p>
                             <p className="text-sm font-bold text-green-700 flex items-center justify-end">
                                <Clock size={14} className="mr-1"/> 05:00 - 22:00
                             </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MÔ TẢ & TIỆN ÍCH */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-24">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Giới thiệu</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">
                    {court.description}
                </p>

                <h3 className="text-lg font-bold text-gray-800 mb-3">Tiện ích sân</h3>
                <div className="grid grid-cols-2 gap-3">
                    {court.features && court.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 text-sm">
                           <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" /> 
                           <span className="font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. NÚT ĐẶT SÂN (DÍNH Ở DƯỚI) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex justify-center">
                 <div className="w-full max-w-md"> {/* Giữ nút trong khung max-w-md */}
                    <button
                        onClick={() => navigateTo('booking', { courtId: court.id })}
                        disabled={isMaintenance}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-lg transition active:scale-95 ${
                            isMaintenance
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isMaintenance ? 'Đang Bảo Trì' : 'ĐẶT LỊCH NGAY'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CourtDetailsScreen;