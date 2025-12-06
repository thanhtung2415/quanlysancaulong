import React from 'react';
import { MapPin, ArrowRight, Star } from 'lucide-react';

const CourtCard = ({ court, onBook, onViewDetails }) => {
    const isMaintenance = court.status !== 'available';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Ảnh Sân */}
            <div className="relative h-48 cursor-pointer" onClick={() => onViewDetails(court.id)}>
                <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                        isMaintenance ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                        {isMaintenance ? 'Bảo trì' : 'Đang mở'}
                    </span>
                </div>
                {/* Rating giả lập */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center text-xs font-bold text-orange-500 shadow-sm">
                    <Star size={12} className="fill-orange-500 mr-1" /> 4.8
                </div>
            </div>

            {/* Nội dung */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{court.name}</h3>
                    <span className="text-green-600 font-extrabold text-lg">
                        {(court.price/1000).toLocaleString()}k
                    </span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    <span className="line-clamp-1">{court.address}</span>
                </div>

                <button
                    onClick={onBook}
                    disabled={isMaintenance}
                    className={`mt-auto w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        isMaintenance
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 shadow-lg'
                    }`}
                >
                    {isMaintenance ? 'Tạm đóng cửa' : 'Đặt Sân Ngay'} 
                    {!isMaintenance && <ArrowRight size={16} className="ml-2" />}
                </button>
            </div>
        </div>
    );
};

export default CourtCard;