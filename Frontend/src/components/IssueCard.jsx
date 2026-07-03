import React from 'react';
import {Badge} from "./Badge.jsx";
import PropTypes from "prop-types";

export function IssueCard({issue, onClick, className = "", disabled, ...props}) {
    if (!issue) return null;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                group flex flex-col justify-between p-5 w-full 
                bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700 
                rounded-lg transition-all shadow-sm font-medium
                ${disabled
                ? "opacity-50"
                : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md hover:-translate-y-1 hover:cursor-pointer active:scale-95"
            } ${className}`}
            {...props}
        >
            <div className="flex justify-between gap-4 h-full w-full text-left">
                {/* Lato sinistro card */}
                <div className="flex flex-col gap-2 overflow-hidden w-full">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                        {issue.title}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                        {issue.description}
                    </p>
                </div>

                {/* Lato destro card */}
                <div className="flex flex-col gap-2 ml-2 shrink-0 items-end">
                    <Badge variant={issue.status?.theme || 'NEUTRAL'}>
                        {issue.status?.name || 'Stato non disponibile'}
                    </Badge>

                    <Badge variant="type">
                        {issue.type}
                    </Badge>

                    {issue.priority && (
                        <Badge variant="priority">
                            Priorità
                        </Badge>
                    )}
                </div>
            </div>
        </button>
    );
}

IssueCard.propTypes = {
    issue: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired
}