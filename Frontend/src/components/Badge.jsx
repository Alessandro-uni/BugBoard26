export function Badge({children, variant = 'default', className = ''}) {
    const baseClasses = "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-md";

    const variants = {
        default: "border border-gray-200 bg-gray-100 text-gray-800",
        TODO: "border border-gray-200 bg-gray-100 text-gray-700",
        IN_PROGRESS: "border border-blue-200 bg-blue-100 text-blue-700",
        RESOLVED: "border border-green-200 bg-green-100 text-green-700",
        CLOSED: "border border-red-200 bg-red-100 text-red-700",
        priority: "border border-yellow-200 bg-yellow-100 text-yellow-700"
    };

    const combinedClasses = `${baseClasses} ${variants[variant] || variants.default} ${className}`;

    return (
        <span className={combinedClasses}>
            {children}
        </span>
    );
}