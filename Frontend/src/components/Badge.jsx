import PropTypes from 'prop-types'

export function Badge({children, variant = 'default', className = ''}) {
    const baseClasses = "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-md border";

    const variants = {
        default: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
        NEUTRAL: "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
        INFO: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
        SUCCESS: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-900/30 dark:text-green-300",
        DANGER: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300",
        priority: "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300",
        type: "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-300"
    };

    const combinedClasses = `${baseClasses} ${variants[variant] || variants.default} ${className}`;

    return (
        <span className={combinedClasses}>
            {children}
        </span>
    );
}

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf('default', 'NEUTRAL', 'INFO', 'SUCCESS', 'DANGER', 'priority', 'type'),
    className: PropTypes.string
}