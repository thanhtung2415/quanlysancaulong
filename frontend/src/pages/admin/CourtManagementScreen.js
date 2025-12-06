import React, { useState, useContext, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const CourtManagementScreen = () => {
    const { user } = useContext(AuthContext);
    const [courts, setCourts] = useState([]);
    const [newCourtName, setNewCourtName] = useState('');
    const [newCourtPrice, setNewCourtPrice] = useState(150000);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCourts = async () => {
        const res = await mockApiCall('GET', `${MOCK_API_BASE}/courts`);
        setCourts(res.courts);
    };

    useEffect(() => { fetchCourts(); }, []);

    const handleCreateCourt = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await mockApiCall('POST', `${MOCK_API_BASE}/courts`, { 
                name: newCourtName, price: newCourtPrice, address: 'Địa chỉ mới (Mock)', description: 'Sân mới tạo.'
            });
            setMessage({ type: 'success', text: `Đã tạo sân "${newCourtName}".` });
            setNewCourtName('');
            fetchCourts();
        } catch (err) { setMessage({ type: 'error', text: err.message }); } 
        finally { setLoading(false); }
    };
    
    const handleUpdateCourtStatus = async (courtId, currentStatus) => {
        if (user.role !== 'admin') return alert('Chỉ Admin mới có quyền.');
        const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
        try {
            await mockApiCall('PATCH', `${MOCK_API_BASE}/courts/${courtId}/status`, { status: newStatus });
            setMessage({ type: 'success', text: `Đã đổi trạng thái sân.` });
            fetchCourts();
        } catch (err) { setMessage({ type: 'error', text: err.message }); }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Quản Lý Sân</h2>
            {message && <div className={`p-3 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
            
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold mb-3 flex items-center"><Plus size={20} className="mr-2"/> Tạo Sân Mới</h3>
                <form onSubmit={handleCreateCourt} className="space-y-3">
                    <input type="text" value={newCourtName} onChange={(e) => setNewCourtName(e.target.value)} placeholder="Tên Sân" required className="w-full p-2 border rounded-lg" />
                    <div className="flex space-x-2">
                        <input type="number" value={newCourtPrice} onChange={(e) => setNewCourtPrice(parseInt(e.target.value))} placeholder="Giá" required className="w-full p-2 border rounded-lg" />
                         <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{loading ? '...' : 'Tạo'}</button>
                    </div>
                </form>
            </div>
            
            <h3 className="text-lg font-bold mb-3">Danh Sách Sân</h3>
            <div className="space-y-3">
                {courts.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between border-l-4 border-gray-300">
                        <div>
                            <p className="font-bold text-gray-800">{c.name}</p>
                            <p className={`text-sm font-semibold ${c.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>
                                <span className="capitalize">{c.status === 'available' ? 'Khả dụng' : 'Bảo trì'}</span>
                            </p>
                            <p className="text-xs text-gray-500">{c.price.toLocaleString('vi-VN')} VND/h</p>
                        </div>
                        {user.role === 'admin' && (
                            <button onClick={() => handleUpdateCourtStatus(c.id, c.status)} className={`px-3 py-1 text-xs font-semibold rounded-lg ${c.status === 'available' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                {c.status === 'available' ? 'Bảo trì' : 'Mở lại'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CourtManagementScreen;