import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockApiCall } from '../api/mockApi'; 
import { MOCK_API_BASE } from '../utils/constants'; // <--- SỬA LẠI DÒNG NÀY ĐÚNG ĐƯỜNG DẪN
import BookingDetailsCard from '../components/BookingDetailsCard';

const MyBookingsScreen = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (!user) return;
        // Gọi API lấy danh sách booking
        mockApiCall('GET', `${MOCK_API_BASE}/bookings`).then(res => setBookings(res.bookings));
    }, [user]);

    const handleCancelMock = (id) => alert(`Hủy đơn ${id} (Mock)`);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Lịch Sử Của Tôi</h2>
            {bookings.length === 0 ? <p className="text-center text-gray-500">Chưa có lịch đặt.</p> : 
                bookings.map(b => <BookingDetailsCard key={b.id} booking={b} onCancel={handleCancelMock} />)
            }
        </div>
    );
};
export default MyBookingsScreen;