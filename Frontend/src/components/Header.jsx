import React, {useState} from "react";
import {Home, Menu, Sun, Moon, Bell, X} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";


function Header ({theme, setTheme,onToggleMenu, onHomeClick, isHomeOpen, notifications, removeNotification}){

    const [showNotifications, setShowNotifications] = useState(false);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors" >

            {/* Hamburger menu */}
            <CustomButton
                variant="secondary"
                onClick={onToggleMenu}
            >
                <Menu size={24} className="text-gray-900 dark:text-white"/>
            </CustomButton>

            {/* Toggle Tema
            <button onClick={toggleTheme}>
                {theme === 'light' ? <Moon /> : <Sun />}
            </button>

            {/* Tasto home
            <CustomButton
                variant="secondary"
                onClick={onHomeClick}
                disabled={isHomeOpen}
            >
                <Home size={24} className="text-gray-900 dark:text-white"/>
            </CustomButton>
            */}

            <div className="flex items-center gap-3">

                {/* 1. Notifiche */}
                <div className="relative">
                    <CustomButton variant="secondary" onClick={() => setShowNotifications(!showNotifications)}>
                        <Bell size={24} className="text-gray-900 dark:text-white" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </CustomButton>

                    {/* Dropdown Notifiche */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifiche</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Nessuna notifica</div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                                            </div>
                                            <button onClick={() => removeNotification(notif.id)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Toggle Tema */}
                <CustomButton variant="secondary" onClick={toggleTheme}>
                    {theme === 'light'
                        ? <Moon size={24} className="text-gray-900" />
                        : <Sun size={24} className="text-yellow-500" />
                    }
                </CustomButton>

                {/* 3. Home */}
                <CustomButton variant="secondary" onClick={onHomeClick} disabled={isHomeOpen}>
                    <Home size={24} className="text-gray-900 dark:text-white" />
                </CustomButton>
            </div>



        </header>
    );

}
export default Header;