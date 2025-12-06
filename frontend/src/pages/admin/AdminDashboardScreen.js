import React, { useContext } from 'react';
import { CornerDownLeft, LayoutList, HardHat, User, DollarSign, BarChart, Edit, ChevronLeft } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboardScreen = ({ navigateTo }) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user.role === 'admin';
    const isStaff = user.role === 'staff';

    const MenuItem = ({ icon: Icon, color, title, onClick }) => (
        <button onClick={onClick} className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 border-${color}-500 hover:bg-gray-100 transition`}>
            <span className={`font-semibold text-lg text-${color}-700 flex items-center`}><Icon size={20} className="mr-3"/> {title}</span>
            <ChevronLeft size={24} className={`rotate-180 text-${color}-500`}/>
        </button>
    );

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-red-700">Quản Lý Hệ Thống ({user.role.toUpperCase()})</h2>
            <div className="grid grid-cols-1 gap-4">
                {(isAdmin || isStaff) && <MenuItem icon={CornerDownLeft} color="orange" title="Đặt Sân Khách Vãng Lai" onClick={() => navigateTo('staffBooking')} />}
                {(isAdmin || isStaff) && <MenuItem icon={LayoutList} color="red" title="Quản Lý Lịch & Check-in" onClick={() => navigateTo('allBookings')} />}
                {(isAdmin || isStaff) && <MenuItem icon={HardHat} color="indigo" title="Quản Lý Sân" onClick={() => navigateTo('courtManagement')} />}
                {isAdmin && <MenuItem icon={User} color="pink" title="Quản Lý Người Dùng" onClick={() => navigateTo('userManagement')} />}
                {isAdmin && <MenuItem icon={DollarSign} color="green" title="Quản Lý Giao Dịch" onClick={() => navigateTo('allPayments')} />}
                {isAdmin && <MenuItem icon={BarChart} color="teal" title="Báo Cáo Doanh Thu" onClick={() => navigateTo('revenueReport')} />}
                {isAdmin && <MenuItem icon={Edit} color="yellow" title="Quản Lý Gói Thành Viên" onClick={() => navigateTo('adminMembership')} />}
            </div>
        </div>
    );
};
export default AdminDashboardScreen;