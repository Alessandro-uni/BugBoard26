import React from "react";
import {Home, Menu} from 'lucide-react';

function Header ({onToggleMenu, onHomeClick}){
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6" >

            {/*hamburger menu*/}
            <button
                onClick={onToggleMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Menu size={24} className="text-gray-900" />
            </button>

            <button
                onClick={onHomeClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Home size={24} className="text-gray-900" />
            </button>

        </header>
    );

}
export default Header;