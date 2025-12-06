/* --- START OF FILE BookingDetailsCard.js --- */
import React from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { MOCK_DB } from '../api/mockApi';

const BookingDetailsCard = ({ booking, onCancel }) => {
    const clubInfo = MOCK_DB.clubInfo;
    const court = MOCK_DB.courts.find(c => c.id === booking.courtId);
    
    // Status Logic & Styling
    const getStatusStyle = (status) => {
        switch(status) {
            case 'checked_in': return 'bg-green-100 text-green-700';
            case 'booked': return 'bg-blue-100 text-blue-700';
            case 'awaiting_payment': return 'bg-orange-100 text-orange-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    const getStatusText = (status) => {
        const map = {
            'checked_in': 'Đã Check-in', 'booked': 'Đã Cọc', 
            'awaiting_payment': 'Chờ TT', 'cancelled': 'Đã Hủy'
        };
        return map[status] || status;
    };

    return (
        <div className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 mb-4 overflow-hidden relative">
            {/* Thanh màu bên trái thể hiện trạng thái */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusStyle(booking.status).split(' ')[0].replace('100', '500')}`}></div>
            
            <div className="p-4 pl-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{court?.name || booking.courtName}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin size={12} className="mr-1" /> {clubInfo.address}
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusStyle(booking.status)}`}>
                        {getStatusText(booking.status)}
                    </span>
                </div>

                {/* Thông tin Giờ & Ngày - Layout 2 cột */}
                <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                    <div className="flex-1 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-2 text-green-600">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Ngày</p>
                            <p className="font-semibold text-sm text-gray-800">
                                {new Date(booking.date).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'})}
                            </p>
                        </div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-1 flex items-center pl-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-2 text-green-600">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Giờ</p>
                            <p className="font-semibold text-sm text-gray-800">{booking.timeSlot}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm">
                        <span className="text-gray-500">Tổng tiền: </span>
                        <span className="font-bold text-green-700 text-base">
                            {(booking.totalAmount || court?.price).toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    {booking.status !== 'checked_in' && booking.status !== 'cancelled' && (
                        <button 
                            onClick={() => onCancel(booking.id)} 
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition flex items-center"
                        >
                            <X size={14} className="mr-1" /> Hủy
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default BookingDetailsCard;