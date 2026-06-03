import React from 'react';

export function CustomButton({
    children,
    className = "",
    variant = "simple",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    disabled,
    ...props
}) {

    const baseClasses = "inline-flex items-center justify-center gap-2 transition-all font-medium rounded-lg focus:outline-none focus:ring-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-800 shadow-sm " +
            "dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-400" ,
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm " +
            "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-400" ,
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-800 shadow-sm " +
            "dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-800 shadow-sm " +
            "dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    }

    const stateClasses = disabled
        ? "opacity-30 cursor-not-allowed"
        : "hover:cursor-pointer active:scale-90";

    const iconSizes = {sm: 16, md: 18, lg: 20};
    const currentIconSize = iconSizes[size] || 18;

    return (
        <button
            disabled={disabled}
            className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${stateClasses} ${className}`}
            {...props}
        >
            {Icon && iconPosition === 'left' && (
                <Icon size={currentIconSize} className="shrink-0"/>
            )}

            {children}

            {Icon && iconPosition === 'right' && (
                <Icon size={currentIconSize} className="shrink-0"/>
            )}
        </button>
    );
}