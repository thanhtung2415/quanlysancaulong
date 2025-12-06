import React, { useState } from 'react';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const AdminMembershipScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(500000);
    const [durationDays, setDurationDays] = useState(90);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleCreateMembership = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await mockApiCall('POST', `${MOCK_API_BASE}/memberships`, { name, price, durationDays, discount: 0.05, description });
            setMessage({ type: 'success', text: `Đã tạo gói "${name}".` });
        } catch (err) { setMessage({ type: 'error', text: err.message }); }
        finally { setLoading(false); }
    };
    
    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Tạo Gói Thành Viên</h2>
            {message && <div className={`p-3 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>{message.text}</div>}
            <form onSubmit={handleCreateMembership} className="bg-white p-4 rounded-xl shadow-lg space-y-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên gói" required className="w-full p-2 border rounded-lg" />
                <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} placeholder="Giá" required className="w-full p-2 border rounded-lg" />
                <input type="number" value={durationDays} onChange={(e) => setDurationDays(parseInt(e.target.value))} placeholder="Số ngày" required className="w-full p-2 border rounded-lg" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả" className="w-full p-2 border rounded-lg" />
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
                    {loading ? '...' : 'Tạo Gói'}
                </button>
            </form>
        </div>
    );
};
export default AdminMembershipScreen;