import React from 'react';
import { User, Phone, Info, Calendar, DollarSign, CreditCard, ChevronLeft } from 'lucide-react';
import { MOCK_DB } from '../api/mockApi';

const PaymentModal = ({ bookingDetails, onConfirmPayment, onClose }) => {
    if (!bookingDetails) return null;
    const { courtName, date, timeSlot, amountToPay, totalAmount, paymentType, bookingId, userName, userPhone } = bookingDetails;
    const paymentLabel = paymentType === 'deposit' ? 'Cần cọc' : 'Thanh toán';
    const bankInfo = MOCK_DB.clubInfo.bank;
    const qrCodePlaceholderUrl = `https://placehold.co/100x100/4F46E5/ffffff?text=QR+Techcombank\n${amountToPay.toLocaleString('vi-VN')}`;

    const renderInfoRow = (Icon, label, value, isBold = false) => (
        <div className="flex items-start py-2 border-b border-gray-100 last:border-b-0">
            <Icon size={18} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-sm ${isBold ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>{value}</p>
            </div>
        </div>
    );
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform scale-100 transition-transform duration-300 overflow-y-auto max-h-full">
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-green-700 transition"><ChevronLeft size={24} /></button>
                    <h3 className="text-xl font-bold">Thanh toán</h3>
                    <div className="w-6"></div>
                </div>
                <div className="p-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200">
                        <h4 className="text-md font-bold text-gray-800 mb-3">Thông tin lịch đặt</h4>
                        <div className="space-y-1">
                            {renderInfoRow(User, 'Tên', userName || 'KháchNhi')}
                            {renderInfoRow(Phone, 'SĐT', userPhone || '0389204681')}
                            {renderInfoRow(Info, 'Mã đơn', `#${bookingId.slice(-5)}`, true)}
                            <div className="flex items-start py-2 border-b border-gray-100">
                                <Calendar size={18} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Chi tiết đặt</p>
                                    <p className="text-sm text-gray-800">{formattedDate} - C.{courtName.split(' ')[0]} {timeSlot}</p>
                                </div>
                            </div>
                            {renderInfoRow(DollarSign, 'Tổng đơn', `${totalAmount.toLocaleString('vi-VN')} ₫`, true)}
                            {renderInfoRow(CreditCard, paymentLabel, `${amountToPay.toLocaleString('vi-VN')} ₫`, true)}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200">
                        <h4 className="text-md font-bold text-gray-800 mb-3">1. Tài khoản ngân hàng</h4>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Tên TK: <span className="font-semibold text-gray-800">{bankInfo.accountName}</span></p>
                                <p className="text-sm text-gray-500">Số TK: <span className="font-semibold text-gray-800">{bankInfo.accountNumber}</span></p>
                                <p className="text-sm text-gray-500">Ngân hàng: <span className="font-semibold text-gray-800">{bankInfo.bankName}</span></p>
                            </div>
                            <img src={qrCodePlaceholderUrl} alt="Mã QR" className="w-16 h-16 border rounded-md" />
                        </div>
                    </div>
                    <button onClick={onConfirmPayment} className="w-full py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition">XÁC NHẬN ĐẶT</button>
                </div>
            </div>
        </div>
    );
};
export default PaymentModal;