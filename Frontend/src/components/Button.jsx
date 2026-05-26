import React from 'react';

export function Button({children, className = "", icon: Icon, ...props}) {
    return (
        <button
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer active:scale-95 transition-all shadow-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {Icon && <Icon size={18} className="text-gray-500"/>}
            {children}
        </button>
    );
}