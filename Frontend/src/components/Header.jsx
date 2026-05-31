import React from "react";
import {Home, Menu} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";

function Header ({onToggleMenu, onHomeClick, isHomeOpen}){
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6" >

            {/* Hamburger menu */}
            <CustomButton
                variant="secondary"
                onClick={onToggleMenu}
            >
                <Menu size={24} className="text-gray-900"/>
            </CustomButton>

            {/* Tasto home */}
            <CustomButton
                variant="secondary"
                onClick={onHomeClick}
                disabled={isHomeOpen}
            >
                <Home size={24} className="text-gray-900"/>
            </CustomButton>

        </header>
    );

}
export default Header;