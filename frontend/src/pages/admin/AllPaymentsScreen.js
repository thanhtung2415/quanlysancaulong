import React, { useState, useEffect, useContext } from 'react';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants'; // Import từ constants mới đúng
import { AuthContext } from '../../context/AuthContext';
const AllPaymentsScreen = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    
    useEffect(() => {
        const fetchPayments = async () => {
            if (user?.role === 'admin') {
                try {
                    const res = await mockApiCall('GET', `${MOCK_API_BASE}/payments`);
                    setPayments(res.payments);
                } catch(e) { console.error(e); }
            }
        };
        fetchPayments();
    }, [user]);

    if (user?.role !== 'admin') return <div className="p-4 text-red-500">Không có quyền truy cập.</div>;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Lịch Sử Giao Dịch</h2>
            <div className="space-y-2">
                {payments.length === 0 ? <p>Chưa có giao dịch.</p> : payments.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded shadow flex justify-between">
                        <div>
                            <p className="font-bold text-gray-700">#{p.bookingId}</p>
                            <p className="text-xs text-gray-500">{new Date(p.paidAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-green-600">+{p.amount.toLocaleString()} VND</p>
                            <p className="text-xs uppercase bg-gray-200 inline-block px-1 rounded">{p.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AllPaymentsScreen;