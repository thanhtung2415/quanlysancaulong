import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BarChart, RefreshCcw } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';

const RevenueReportScreen = () => {
    const { user } = useContext(AuthContext);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mockApiCall('GET', `${MOCK_API_BASE}/reports/revenue`);
            setReport(response.report);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') fetchReport();
        else { setError('Không có quyền.'); setLoading(false); }
    }, [fetchReport, user]);

    if (loading) return <div className="p-4 text-center"><RefreshCcw className="animate-spin inline mr-2" /> Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!report) return null;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center"><BarChart size={20} className="mr-2"/> Báo Cáo Doanh Thu</h2>
            <div className="bg-white p-6 rounded-xl shadow-2xl space-y-4">
                <div className="p-4 bg-green-100 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-700">Tổng Doanh Thu</p>
                    <p className="text-3xl font-extrabold text-green-800">{report.totalRevenue.toLocaleString('vi-VN')} VND</p>
                </div>
                <div className="flex justify-between space-x-4">
                     <div className="flex-1 p-3 bg-indigo-50 rounded-lg text-center">
                        <p className="text-sm font-medium text-indigo-700">Tổng Lượt Đặt</p>
                        <p className="text-xl font-bold text-indigo-800">{report.totalBookings}</p>
                    </div>
                </div>
                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">Phạm vi: {report.startDate} đến {report.endDate}</p>
                </div>
            </div>
        </div>
    );
};
export default RevenueReportScreen;