import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const MembershipScreen = ({ navigateTo }) => {
    const { user, isAuthorized } = useContext(AuthContext);
    const [memberships, setMemberships] = useState([]);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        mockApiCall('GET', `${MOCK_API_BASE}/memberships`).then(res => setMemberships(res.memberships));
    }, []);

    const handleSubscribe = async (membershipId) => {
        if (user.isMember) return setMessage({ type: 'error', text: 'Đã là thành viên.' });
        setLoading(true);
        try {
            const res = await mockApiCall('POST', `${MOCK_API_BASE}/memberships/subscribe`, { membershipId });
            setMessage({ type: 'success', text: res.message });
        } catch (err) { setMessage({ type: 'error', text: err.message }); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-yellow-700">Các Gói Thành Viên</h2>
            {user?.isMember && <div className="bg-green-100 text-green-700 p-4 rounded-lg font-bold mb-4 flex items-center"><CheckCircle size={20} className="mr-2" /> Bạn đã là Thành viên!</div>}
            {message && <div className={`p-3 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>{message.text}</div>}
            
            {isAuthorized(['admin']) && (
                <button onClick={() => navigateTo('adminMembership')} className="w-full py-3 mb-4 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 flex items-center justify-center">
                    <Plus size={20} className="mr-2" /> Tạo Gói Mới (Admin)
                </button>
            )}

            <div className="space-y-4">
                {memberships.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-yellow-500">
                        <h3 className="text-xl font-bold text-yellow-700">{m.name}</h3>
                        <p className="text-2xl font-extrabold text-indigo-600 my-2">{m.price.toLocaleString('vi-VN')} VND</p>
                        <p className="text-sm text-gray-600 mb-2">{m.description}</p>
                        <p className="text-xs text-gray-500">Hạn: {m.durationDays} ngày</p>
                        <button onClick={() => handleSubscribe(m.id)} disabled={loading || user.isMember} className="w-full mt-3 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50">
                            {loading ? '...' : user.isMember ? 'Đã Sở Hữu' : 'Mua Ngay'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MembershipScreen;