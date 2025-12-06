import React, { useState, useEffect, useCallback, useContext } from 'react';
import { RefreshCcw } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const UserManagementScreen = () => {
    const { user } = useContext(AuthContext);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mockApiCall('GET', `${MOCK_API_BASE}/users`);
            setUserList(response.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') fetchUsers();
        else { setError('Bạn không có quyền.'); setLoading(false); }
    }, [fetchUsers, user]);

    const handleUpdateRole = async (targetId, currentRole) => {
        const newRole = currentRole === 'user' ? 'staff' : 'user';
        try {
            await mockApiCall('PATCH', `${MOCK_API_BASE}/users/${targetId}/role`, { role: newRole });
            setMessage({ type: 'success', text: `Đã cập nhật vai trò thành ${newRole.toUpperCase()}.` });
            fetchUsers();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) return <div className="p-4 text-center"><RefreshCcw className="animate-spin inline mr-2" /> Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Quản Lý Người Dùng</h2>
            {message && <div className={`p-3 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
            <div className="space-y-3">
                {userList.map(u => (
                    <div key={u.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-800">{u.username}</p>
                            <p className="text-sm text-gray-500">Vai trò: <span className="font-semibold capitalize">{u.role}</span></p>
                            <p className="text-xs text-gray-400">{u.phone}</p>
                        </div>
                        <button onClick={() => handleUpdateRole(u.id, u.role)} className={`px-3 py-1 text-sm font-semibold rounded-lg transition ${u.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-yellow-500 text-black'}`}>
                            {u.role === 'user' ? 'Gán Staff' : 'Gỡ Staff'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default UserManagementScreen;