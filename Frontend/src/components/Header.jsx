import React from "react";
import {Home, Menu, Sun, Moon} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";


function Header ({theme, setTheme,onToggleMenu, onHomeClick, isHomeOpen}){

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

            <div className="flex items-center gap-3">
                {/* Toggle Tema */}
                <CustomButton
                    variant="secondary"
                    onClick={toggleTheme}
                >
                    {theme === 'light'
                        ? <Moon size={24} className="text-gray-900"/>
                        : <Sun size={24} className="text-yellow-500"/>
                    }
                </CustomButton>

                {/* Home */}
                <CustomButton
                    variant="secondary"
                    onClick={onHomeClick}
                    disabled={isHomeOpen}
                >
                    <Home size={24} className="text-gray-900 dark:text-white"/>
                </CustomButton>
            </div>
        </header>
    );

}
export default Header;