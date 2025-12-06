import React, { useState, useEffect, useCallback, useContext } from 'react';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const AllBookingsScreen = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchAllBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mockApiCall('GET', `${MOCK_API_BASE}/bookings/all`);
            setBookings(response.bookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
        } catch (err) {
            setError(err.message || 'Lỗi khi tải lịch đặt.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'staff') {
             fetchAllBookings();
        } else if (user) {
            setError('Bạn không có quyền truy cập.');
            setLoading(false);
        }
    }, [fetchAllBookings, user]);

    const handleCheckIn = async (bookingId) => {
        setMessage(null);
        try {
            await mockApiCall('PATCH', `${MOCK_API_BASE}/bookings/${bookingId}/checkin`);
            setMessage({ type: 'success', text: `Check-in thành công #${bookingId}` });
            fetchAllBookings();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) return <div className="p-4 text-center"><RefreshCcw className="animate-spin inline mr-2" /> Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Quản Lý Lịch Đặt</h2>
            {message && (
                <div className={`p-3 mb-4 rounded-lg font-medium flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <XCircle size={20} className="mr-2" />}
                    {message.text}
                </div>
            )}
            <div className="space-y-4">
                {bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500">
                        <p className="text-xs font-mono text-gray-500">ID: {booking.id}</p>
                        <h3 className="text-lg font-bold text-indigo-700">{booking.courtName}</h3>
                        <p className="text-sm text-gray-600">Ngày: <b>{booking.date}</b> | Giờ: <b className="text-green-600">{booking.timeSlot}</b></p>
                        <p className="text-sm text-gray-600 mb-2">Người đặt: <b>{booking.userName || booking.userId}</b></p>
                        <div className="flex items-center justify-between mt-3">
                            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'checked_in' ? 'bg-green-200 text-green-800' : booking.status === 'booked' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                                {booking.status === 'checked_in' ? 'Đã Check-in' : booking.status === 'booked' ? 'Đã Đặt Cọc' : 'Chờ Thanh Toán'}
                            </div>
                            {booking.status === 'booked' && (
                                <button onClick={() => handleCheckIn(booking.id)} className="flex items-center px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
                                    <CheckCircle size={16} className="mr-1" /> Check-in
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AllBookingsScreen;