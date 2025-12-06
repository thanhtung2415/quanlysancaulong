import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { MOCK_DB } from './api/mockApi';
import TopNav from './components/TopNav'; // <--- IMPORT MENU MỚI
import Header from './components/Header'; // Vẫn giữ Header cũ cho các trang con (Chi tiết, Đặt sân...)

// --- IMPORT PAGES ---
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import CourtDetailsScreen from './pages/CourtDetailsScreen';
import BookingScreen from './pages/BookingScreen';
import BookingSuccessScreen from './pages/BookingSuccessScreen';
import MyBookingsScreen from './pages/MyBookingsScreen';
import MembershipScreen from './pages/membership/MembershipScreen';
import AdminMembershipScreen from './pages/membership/AdminMembershipScreen';
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen';
import AllBookingsScreen from './pages/admin/AllBookingsScreen';
import CourtManagementScreen from './pages/admin/CourtManagementScreen';
import UserManagementScreen from './pages/admin/UserManagementScreen';
import StaffBookingScreen from './pages/admin/StaffBookingScreen';
import RevenueReportScreen from './pages/admin/RevenueReportScreen';
import AllPaymentsScreen from './pages/admin/AllPaymentsScreen';

const App = () => {
    const { user, logout } = useContext(AuthContext);
    const [screen, setScreen] = useState('home');
    const [screenData, setScreenData] = useState({});

    useEffect(() => {
        if (!user) setScreen('login');
        else if (screen === 'login') setScreen('home');
    }, [user, screen]);

    const navigateTo = (newScreen, data = {}) => {
        setScreen(newScreen);
        setScreenData(data);
        window.scrollTo(0, 0);
    };

    const renderScreen = () => {
        switch (screen) {
            case 'login': return <LoginScreen onLoginSuccess={() => navigateTo('home')} />;
            case 'home': return <HomeScreen navigateTo={navigateTo} />;
            case 'courtDetails': return <CourtDetailsScreen courtId={screenData.courtId} navigateTo={navigateTo} />;
            case 'booking': return <BookingScreen courtId={screenData.courtId} navigateTo={navigateTo} />;
            case 'bookingSuccess': return <BookingSuccessScreen navigateTo={navigateTo} />;
            case 'myBookings': return <MyBookingsScreen navigateTo={navigateTo} />;
            case 'membership': return <MembershipScreen navigateTo={navigateTo} />;
            case 'adminDashboard': return <AdminDashboardScreen navigateTo={navigateTo} />;
            case 'staffBooking': return <StaffBookingScreen navigateTo={navigateTo} />;
            case 'allBookings': return <AllBookingsScreen navigateTo={navigateTo} />;
            case 'courtManagement': return <CourtManagementScreen navigateTo={navigateTo} />;
            case 'userManagement': return <UserManagementScreen navigateTo={navigateTo} />;
            case 'allPayments': return <AllPaymentsScreen navigateTo={navigateTo} />;
            case 'revenueReport': return <RevenueReportScreen navigateTo={navigateTo} />;
            case 'adminMembership': return <AdminMembershipScreen navigateTo={navigateTo} />;
            default: return <HomeScreen navigateTo={navigateTo} />;
        }
    };

    const getScreenTitle = () => {
        const court = MOCK_DB.courts.find(c => c.id === screenData.courtId);
        switch (screen) {
            case 'courtDetails': return court ? `Chi Tiết: ${court.name}` : 'Chi Tiết Sân';
            case 'booking': return 'Đặt Sân';
            case 'bookingSuccess': return 'Thành Công';
            case 'membership': return 'Gói Thành Viên';
            case 'adminDashboard': return 'Quản Lý';
            // ... thêm các title khác nếu cần
            default: return 'Badminton';
        }
    };

    // Chỉ hiện Header cũ (có nút Back) ở các trang CON (không phải Home, Login, MyBookings)
    const showBackHeader = screen !== 'login' && screen !== 'home' && screen !== 'myBookings' && screen !== 'adminDashboard';

       return (
        // ĐỔI CLASS TẠI ĐÂY: Dùng "app-container" thay vì "max-w-md..."
        <div className="app-container shadow-2xl relative">
            
            {/* 1. MENU CHÍNH (TOP NAV) */}
            {user && screen !== 'login' && (
                <TopNav 
                    currentScreen={screen} 
                    navigateTo={navigateTo} 
                    user={user}
                    onLogout={logout}
                />
            )}

            {/* 2. HEADER PHỤ (Chỉ hiện khi cần nút Back) */}
            {showBackHeader && (
                <Header 
                    title={getScreenTitle()}
                    showBackButton={true}
                    onBack={() => navigateTo('home')}
                    showAuthButton={false} 
                />
            )}
            
            <main className="pb-8">
                {renderScreen()}
            </main>
        </div>
    );
};

export default function WrappedApp() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}