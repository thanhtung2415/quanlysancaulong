import React, { useState, useEffect } from 'react'; // Bỏ useContext vì không dùng user
// Bỏ AuthContext vì không dùng
import { mockApiCall } from '../../api/mockApi'; // Bỏ MOCK_DB vì không dùng
import { MOCK_API_BASE, TIME_SLOTS } from '../../utils/constants';

const StaffBookingScreen = () => {
    // Xóa dòng lấy user vì trong file này logic không cần dùng đến biến user
    const [courts, setCourts] = useState([]);
    
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await mockApiCall('GET', `${MOCK_API_BASE}/courts`);
                setCourts(res.courts.filter(c => c.status === 'available'));
            } catch (e) { console.error(e); }
        };
        fetchCourts();
    }, []);

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [selectedCourtId, setSelectedCourtId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0].slot);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (courts.length > 0 && !selectedCourtId) {
            setSelectedCourtId(courts[0].id);
        }
    }, [courts, selectedCourtId]);

    const handleStaffCreateBooking = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const court = courts.find(c => c.id === selectedCourtId);
        const slotDetail = TIME_SLOTS.find(s => s.slot === timeSlot);
        if (!court || !slotDetail) return setLoading(false);
        
        const totalAmount = court.price * slotDetail.duration;

        try {
            await mockApiCall('POST', `${MOCK_API_BASE}/bookings/staff-create`, {
                courtId: selectedCourtId, date: selectedDate, timeSlot: timeSlot,
                durationHours: slotDetail.duration, totalAmount: totalAmount,
                depositAmount: 0, clientName, clientPhone
            });
            setMessage({ type: 'success', text: `Đã đặt sân cho ${clientName} thành công!` });
            // Reset form
            setClientName('');
            setClientPhone('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Staff Đặt Sân Hộ Khách</h2>
            {message && <div className={`p-3 mb-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
            </div>}
            
            <form onSubmit={handleStaffCreateBooking} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                <h3 className="text-lg font-bold mb-2 text-indigo-700">Thông tin Khách Vãng Lai</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên Khách Hàng</label>
                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="w-full p-2 border rounded-lg" placeholder="VD: Anh Nam" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số Điện Thoại</label>
                        <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required className="w-full p-2 border rounded-lg" placeholder="09xxxx" />
                    </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 pt-4 border-t text-indigo-700">Chi tiết Đặt Sân</h3>
                <div>
                    <label className="block text-sm font-medium mb-1">Chọn Sân</label>
                    <select value={selectedCourtId} onChange={(e) => setSelectedCourtId(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50">
                        {courts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.price.toLocaleString()}đ/h)</option>)}
                    </select>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Ngày</label>
                         <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Khung Giờ</label>
                        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full p-2 border rounded-lg">
                            {TIME_SLOTS.map(s => <option key={s.slot} value={s.slot}>{s.slot} ({s.duration}h)</option>)}
                        </select>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 mt-4 shadow-lg">
                    {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Sân'}
                </button>
            </form>
        </div>
    );
};
export default StaffBookingScreen;