
export let MOCK_DB = {
    courts: [
        { id: 'c1', name: 'Sân Thăng Long A', address: 'Quận 1, TPHCM', price: 150000, description: 'Sân thảm cao su, ánh sáng tốt.', status: 'available', features: ['Thảm cao su', 'Ánh sáng tiêu chuẩn', 'Điều hòa'] },
        { id: 'c2', name: 'Sân Bách Khoa B', address: 'Quận 10, TPHCM', price: 180000, description: 'Hệ thống đèn LED, không gian thoáng.', status: 'available', features: ['Đèn LED mới', 'Không gian rộng rãi', 'Khu vực chờ'] },
        { id: 'c3', name: 'Sân Phú Thọ C', address: 'Quận 11, TPHCM', price: 120000, description: 'Nền xi măng, thích hợp cho người mới.', status: 'maintenance', features: ['Nền xi măng', 'Giá rẻ', 'Gần bãi đỗ xe'] }
    ],
    users: [
        { id: 'user1', username: 'user1', role: 'user', phone: '0389204681', isMember: false },
        { id: 'user2', username: 'user2', role: 'user', phone: '0912345678', isMember: false },
        { id: 'staff', username: 'staff', role: 'staff', phone: '0901111222', isMember: false },
        { id: 'admin1', username: 'admin1', role: 'admin', phone: '0900000000', isMember: false },
    ],
    memberships: [
        { id: 'm1', name: 'Thành viên Đồng', price: 500000, durationDays: 90, discount: 0.05, description: 'Giảm 5% phí sân trong 3 tháng.' },
        { id: 'm2', name: 'Thành viên Vàng', price: 1500000, durationDays: 365, discount: 0.15, description: 'Giảm 15% phí sân trong 1 năm.' }
    ],
    clubInfo: {
        name: "LANH BADMINTON",
        address: "14 Đường 359, Phước Long B, Thành Phố Thủ Đức, Thành Phố Hồ Chí Minh",
        phone: "0903224359",
        bank: {
            accountName: "PHAM TUNG LAM",
            accountNumber: "7903224359",
            bankName: "Techcombank"
        }
    },
    bookings: [],
    payments: [],
    currentUser: null,
};

export const mockApiCall = (method, url, data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const currentUser = MOCK_DB.currentUser;

            // --- AUTH ---
            if (url.includes('/api/auth/login')) {
                const existingUser = MOCK_DB.users.find(u => u.username === data.username);
                if (existingUser) {
                    MOCK_DB.currentUser = existingUser;
                    resolve({ success: true, user: existingUser });
                } else {
                    return reject({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu (Mock)' });
                }
                return;
            }
            
            // --- USERS ---
            if (url.includes('/api/users') && method === 'GET') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới có quyền.' });
                resolve({ success: true, users: MOCK_DB.users.filter(u => u.role !== 'admin') });
                return;
            }
            if (url.includes('/api/users/') && url.includes('/role') && method === 'PATCH') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới có quyền.' });
                const userId = url.split('/')[3];
                const targetUser = MOCK_DB.users.find(u => u.id === userId);
                if (targetUser) {
                    targetUser.role = data.role;
                    resolve({ success: true, user: targetUser });
                } else reject({ success: false, message: 'Không tìm thấy người dùng.' });
                return;
            }
            
            // --- COURTS ---
            if (url.includes('/api/courts') && method === 'POST') {
                if (currentUser?.role !== 'admin' && currentUser?.role !== 'staff') return reject({ success: false, message: 'Không đủ quyền.' });
                const newCourt = { id: `c-${Date.now()}`, status: 'available', features: [], ...data };
                MOCK_DB.courts.push(newCourt);
                resolve({ success: true, court: newCourt });
                return;
            }
            if (url.includes('/api/courts/') && url.includes('/status') && method === 'PATCH') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới có quyền.' });
                const courtId = url.split('/')[3];
                const court = MOCK_DB.courts.find(c => c.id === courtId);
                if (court) {
                    court.status = data.status;
                    resolve({ success: true, court });
                } else reject({ success: false, message: 'Không tìm thấy sân.' });
                return;
            }
            if (url.includes('/api/courts') && method === 'GET') {
                resolve({ success: true, courts: MOCK_DB.courts });
                return;
            }

            // --- MEMBERSHIPS ---
            if (url.includes('/api/memberships') && method === 'GET') {
                resolve({ success: true, memberships: MOCK_DB.memberships });
                return;
            }
            if (url.includes('/api/memberships') && method === 'POST') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới có quyền.' });
                const newMembership = { id: `m-${Date.now()}`, ...data };
                MOCK_DB.memberships.push(newMembership);
                resolve({ success: true, membership: newMembership });
                return;
            }
            if (url.includes('/api/memberships/subscribe') && method === 'POST') {
                if (!currentUser) return reject({ success: false, message: 'Vui lòng đăng nhập.' });
                const membership = MOCK_DB.memberships.find(m => m.id === data.membershipId);
                if (membership) {
                    const userInDB = MOCK_DB.users.find(u => u.id === currentUser.id);
                    if (userInDB) userInDB.isMember = true;
                    currentUser.isMember = true;
                    resolve({ success: true, message: `Đã mua gói ${membership.name} thành công!` });
                } else reject({ success: false, message: 'Không tìm thấy gói.' });
                return;
            }

            // --- BOOKINGS ---
            if (url.includes('/api/bookings/staff-create') && method === 'POST') {
                if (currentUser?.role !== 'admin' && currentUser?.role !== 'staff') return reject({ success: false, message: 'Không đủ quyền.' });
                const { courtId, date, timeSlot, durationHours, totalAmount, depositAmount, clientName, clientPhone } = data;
                const conflict = MOCK_DB.bookings.find(b => b.courtId === courtId && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled');
                if (conflict) return reject({ success: false, message: 'Khung giờ này đã được đặt.' });

                const court = MOCK_DB.courts.find(c => c.id === courtId);
                const newBooking = {
                    id: `s-${Date.now()}-${MOCK_DB.bookings.length + 1}`,
                    courtId, courtName: court?.name, date, timeSlot, durationHours, totalAmount, depositAmount,
                    userId: currentUser.id, userName: clientName, userPhone: clientPhone,
                    bookedAt: new Date().toISOString(), status: 'booked_by_staff'
                };
                MOCK_DB.bookings.push(newBooking);
                resolve({ success: true, booking: newBooking });
                return;
            }

            if (url.includes('/api/bookings') && method === 'POST') {
                const { courtId, date, timeSlot, durationHours, totalAmount, depositAmount } = data;
                const conflict = MOCK_DB.bookings.find(b => b.courtId === courtId && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled');
                if (conflict) return reject({ success: false, message: 'Khung giờ này đã được đặt.' });

                const court = MOCK_DB.courts.find(c => c.id === courtId);
                const newBooking = {
                    id: `b-${Date.now()}-${MOCK_DB.bookings.length + 1}`,
                    courtId, courtName: court.name, date, timeSlot, durationHours, totalAmount, depositAmount,
                    userId: currentUser.id, userName: currentUser.username, userPhone: currentUser.phone,
                    bookedAt: new Date().toISOString(), status: 'awaiting_payment'
                };
                MOCK_DB.bookings.push(newBooking);
                resolve({ success: true, booking: newBooking });
                return;
            }

           if (url.includes('/api/bookings/all') && method === 'GET') {
    // CHO PHÉP TẤT CẢ USER ĐỀU XEM ĐƯỢC ĐỂ HIỂN THỊ KHUNG GIỜ KÍN TRÊN MÀN HÌNH ĐẶT SÂN
    resolve({ success: true, bookings: MOCK_DB.bookings });
    return;
}

            if (url.includes('/api/bookings') && method === 'GET' && !url.includes('/all')) {
                if (!currentUser) return reject({ success: false, message: 'Cần đăng nhập.' });
                resolve({ success: true, bookings: MOCK_DB.bookings.filter(b => b.userId === currentUser.id) });
                return;
            }

            if (url.includes('/api/bookings/status') && method === 'PATCH') {
                const booking = MOCK_DB.bookings.find(b => b.id === data.bookingId);
                if (booking) {
                    booking.status = data.status;
                    resolve({ success: true, booking });
                } else reject({ success: false, message: 'Không tìm thấy lịch đặt.' });
                return;
            }

            if (url.includes('/api/bookings') && url.includes('/checkin') && method === 'PATCH') {
                const id = url.split('/')[3];
                const booking = MOCK_DB.bookings.find(b => b.id === id);
                if (booking) {
                    booking.status = 'checked_in';
                    resolve({ success: true, booking });
                } else reject({ success: false, message: 'Không tìm thấy lịch đặt.' });
                return;
            }

            // --- PAYMENTS ---
            if (url.includes('/api/payments') && method === 'POST') {
                if (!currentUser) return reject({ success: false, message: 'Cần đăng nhập.' });
                const { bookingId, amount, type } = data;
                const newPayment = {
                    id: `p-${Date.now()}`, bookingId, amount, userId: currentUser.id, paidAt: new Date().toISOString(), type: type || 'deposit'
                };
                MOCK_DB.payments.push(newPayment);
                resolve({ success: true, payment: newPayment });
                return;
            }
             if (url.includes('/api/payments') && method === 'GET') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới xem được giao dịch.' });
                resolve({ success: true, payments: MOCK_DB.payments });
                return;
            }

            // --- REPORTS ---
            if (url.includes('/api/reports/revenue') && method === 'GET') {
                if (currentUser?.role !== 'admin') return reject({ success: false, message: 'Chỉ Admin mới có quyền.' });
                const totalRevenue = MOCK_DB.payments.reduce((sum, p) => sum + p.amount, 0);
                resolve({ 
                    success: true, 
                    report: { totalRevenue, totalBookings: MOCK_DB.bookings.length, startDate: '2025-01-01', endDate: '2025-12-31' } 
                });
                return;
            }

            reject({ success: false, message: 'API Route Not Found' });
        }, 300);
    });
};