import {Loader2} from "lucide-react";
import React from "react";
import PropTypes from "prop-types";

export function ReloadingBox({description = ''}) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <Loader2 size={40} className="text-gray-300 dark:text-gray-600 animate-spin mb-4"/>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">{description}</p>
        </div>
    );
}

ReloadingBox.propTypes = {
    description: PropTypes.string
}