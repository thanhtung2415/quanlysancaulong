/* --- START OF FILE TimeSlot.js --- */
import React from 'react';

const TimeSlot = ({ slot, isBooked, isOwned, onClick, duration }) => {
    let baseClasses = "flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 relative overflow-hidden";
    let statusClasses = "";
    let textClasses = "";
    
    // Duration text format
    const durationText = duration % 1 === 0 ? `${duration}h` : `${Math.floor(duration)}h30`;

    if (isOwned) {
        statusClasses = "bg-yellow-50 border-yellow-200 cursor-not-allowed opacity-90";
        textClasses = "text-yellow-700";
    } else if (isBooked) {
        statusClasses = "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60";
        textClasses = "text-gray-400 decoration-line-through";
    } else {
        statusClasses = "bg-white border-gray-200 hover:border-green-500 hover:shadow-md cursor-pointer active:scale-95 group";
        textClasses = "text-gray-700 group-hover:text-green-600 font-medium";
    }

    return (
        <button onClick={onClick} disabled={isBooked || isOwned} className={`${baseClasses} ${statusClasses}`}>
            {/* Nếu còn trống thì hiện vạch màu xanh khi hover */}
            {!isBooked && !isOwned && (
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
            
            <span className={`text-sm ${textClasses}`}>{slot}</span>
            <span className="text-[10px] text-gray-400 mt-1 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
                {isOwned ? 'Của bạn' : isBooked ? 'Đã đặt' : durationText}
            </span>
        </button>
    );
};
export default TimeSlot;