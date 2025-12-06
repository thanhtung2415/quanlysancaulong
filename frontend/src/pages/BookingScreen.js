import React, { useState, useEffect, useContext } from 'react';
import { RefreshCcw, XCircle } from 'lucide-react'; // <--- ĐÃ XÓA CheckCircle
import { AuthContext } from '../context/AuthContext';
import { mockApiCall, MOCK_DB } from '../api/mockApi'; 
import { MOCK_API_BASE, TIME_SLOTS } from '../utils/constants';
import TimeSlot from '../components/TimeSlot';
import PaymentModal from '../components/PaymentModal';

const BookingScreen = ({ courtId, navigateTo }) => {
    const { user } = useContext(AuthContext);
    const court = MOCK_DB.courts.find(c => c.id === courtId);
    
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyBookings, setDailyBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingMessage, setBookingMessage] = useState(null);
    const [paymentType, setPaymentType] = useState('deposit');
    const [showPaymentModal, setShowPaymentModal] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await mockApiCall('GET', `${MOCK_API_BASE}/bookings/all`);
                setDailyBookings(response.bookings.filter(b => b.date === selectedDate && b.status !== 'awaiting_payment'));
            } catch (err) {
                console.warn("Lỗi tải lịch:", err);
                setDailyBookings([]);
            } finally { 
                setLoading(false); 
            }
        };
        fetchBookings();
    }, [selectedDate, user]);

    if (!user) return <div className="p-4 text-center">Đang kiểm tra thông tin...</div>;
    if (!court) return <div className="p-4 text-center text-red-500">Không tìm thấy sân.</div>;

    const handleBooking = async (timeSlot) => {
        setLoading(true);
        setBookingMessage(null);
        const slotDetail = TIME_SLOTS.find(s => s.slot === timeSlot);
        const totalAmount = court.price * slotDetail.duration;
        const amountToPay = paymentType === 'deposit' ? totalAmount * 0.5 : totalAmount;
        
        try {
            const bookingResponse = await mockApiCall('POST', `${MOCK_API_BASE}/bookings`, {
                courtId: court.id, date: selectedDate, timeSlot, durationHours: slotDetail.duration,
                totalAmount, depositAmount: totalAmount * 0.5
            });
            setShowPaymentModal({
                bookingId: bookingResponse.booking.id, courtName: court.name, date: selectedDate, timeSlot,
                totalAmount, amountToPay, paymentType, userName: user.username, userPhone: user.phone
            });
        } catch (err) { 
            setBookingMessage({ type: 'error', text: err.message || 'Lỗi đặt sân' }); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleConfirmPayment = async (details) => {
        setShowPaymentModal(null);
        setLoading(true);
        try {
            await mockApiCall('POST', `${MOCK_API_BASE}/payments`, { bookingId: details.bookingId, amount: details.amountToPay, type: details.paymentType });
            await mockApiCall('PATCH', `${MOCK_API_BASE}/bookings/status`, { bookingId: details.bookingId, status: 'booked' });
            
            // Chuyển sang màn hình thành công
            navigateTo('bookingSuccess'); 

        } catch (err) { 
            setBookingMessage({ type: 'error', text: err.message || 'Lỗi thanh toán' }); 
            setLoading(false);
        }
    };

    const isSlotBooked = (slot) => dailyBookings.find(b => b.courtId === court.id && b.timeSlot === slot && b.status !== 'cancelled');
    const isSlotOwned = (slot) => isSlotBooked(slot)?.userId === user.id;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-green-700 mb-2">{court.name}</h2>
            <p className="text-xl font-extrabold text-green-600 mb-4">{court.price.toLocaleString('vi-VN')} VND/h</p>
            
            <label className="block mb-2 font-medium">Chọn ngày:</label>
            <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border rounded-lg mb-6" />
            
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
                <label className="flex items-center space-x-2 cursor-pointer w-1/2 justify-center p-2 rounded hover:bg-gray-100">
                    <input type="radio" name="pt" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} /> 
                    <div className="text-center">
                        <span className="block font-bold">Cọc 50%</span>
                    </div>
                </label>
                <div className="h-8 w-px bg-gray-300 mx-2"></div>
                <label className="flex items-center space-x-2 cursor-pointer w-1/2 justify-center p-2 rounded hover:bg-gray-100">
                    <input type="radio" name="pt" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} /> 
                    <div className="text-center">
                        <span className="block font-bold">Thanh toán 100%</span>
                    </div>
                </label>
            </div>

            {loading && <p className="text-center text-green-600 mb-4"><RefreshCcw className="animate-spin inline mr-2"/>Đang xử lý...</p>}
            
            {bookingMessage && bookingMessage.type === 'error' && (
                <div className="p-3 mb-4 rounded-lg flex items-center bg-red-100 text-red-700">
                    <XCircle size={20} className="mr-2"/> {bookingMessage.text}
                </div>
            )}

            <h3 className="font-bold mb-3">Khung giờ trống:</h3>
            <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map(s => (
                    <TimeSlot key={s.slot} slot={s.slot} duration={s.duration} isBooked={!!isSlotBooked(s.slot)} isOwned={isSlotOwned(s.slot)} onClick={() => handleBooking(s.slot)} />
                ))}
            </div>
            {showPaymentModal && <PaymentModal bookingDetails={showPaymentModal} onConfirmPayment={() => handleConfirmPayment(showPaymentModal)} onClose={() => setShowPaymentModal(null)} />}
        </div>
    );
};
export default BookingScreen;