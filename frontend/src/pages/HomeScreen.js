import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { mockApiCall, MOCK_DB } from '../api/mockApi';
import { MOCK_API_BASE } from '../utils/constants';
import CourtCard from '../components/CourtCard';

const HomeScreen = ({ navigateTo }) => {
    const { user } = useContext(AuthContext);
    const [courts, setCourts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        mockApiCall('GET', `${MOCK_API_BASE}/courts`)
            .then(res => setCourts(res.courts || MOCK_DB.courts))
            .catch(() => setCourts(MOCK_DB.courts));
    }, []);

    const filteredCourts = courts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* --- HEADER GRADIENT --- */}
            <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-b-[30px] p-6 pt-8 shadow-lg text-white mb-6">
                
                {/* Row: Greeting + Bell */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-green-100 text-sm font-medium">Xin chào,</p>
                        <h2 className="text-2xl font-bold">{user?.username || "Khách"} 👋</h2>

                        {/* >>> ĐÃ DÙNG MapPin <<< */}
                        <div className="flex items-center gap-1 mt-1 text-green-100 text-sm">
                            <MapPin className="w-4 h-4 text-white" />
                            <span>TP. Hồ Chí Minh</span>
                        </div>
                    </div>

                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <Bell size={24} className="text-white" />
                    </div>
                </div>

                {/* Ô TÌM KIẾM */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-12 pr-4 rounded-2xl border-none shadow-md text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-300 outline-none"
                    />
                </div>
            </div>

            {/* --- DANH SÁCH SÂN --- */}
            <div className="px-4">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Danh sách sân</h3>
                    <span className="text-green-600 text-sm font-semibold cursor-pointer">
                        Xem tất cả
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredCourts.map(court => (
                        <CourtCard
                            key={court.id}
                            court={court}
                            onBook={() => navigateTo('booking', { courtId: court.id })}
                            onViewDetails={() => navigateTo('courtDetails', { courtId: court.id })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
