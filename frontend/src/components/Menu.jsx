import React from "react";
import {Home, List, PlusCircle, UserPlus, ClipboardList, Key, LogOut, CircleAlert, X} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Menu({ currentPage, onNavigate, isOpen, onClose }) {

    // Configurazione del menu
    const menuSections = [
        {
            title: 'Menu Principale',
            items: [
                { icon: Home, label: 'Home' },
                { icon: List, label: 'Le mie Issue' },
                { icon: List, label: 'Visualizza tutte le Issue' },
                { icon: PlusCircle, label: 'Crea Issue' },
            ]
        },

        {
            title: 'Account',
            items: [
                { icon: Key, label: 'Cambia Password' },
                { icon: LogOut, label: 'Esci' },
            ]
        }
    ];

    const handleNavigate = (page) => {
        onNavigate(page);
        onClose(); // Chiude la sidebar dopo il click
    };

    return (
        <>
            {/* Overlay: lo sfondo scuro che appare dietro la sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-40 flex flex-col"
                    >


                        {/* Logo o Titolo */}
                        <div className="p-6 pt-20">
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Chiudi Menu">
                                <X size={24} className="text-gray-900" />
                            </button>

                            <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
                            <p className="text-xs text-blue-900 mt-1">User</p>
                        </div>

                        {/* Navigazione */}
                        <nav className="flex-1 px-4 overflow-y-auto">
                            {menuSections.map((section, sectionIndex) => (
                                <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
                                    <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        {section.title}
                                    </h3>

                                    {section.items.map((item, itemIndex) => {
                                        const Icon = item.icon;
                                        const isActive = currentPage === item.label;

                                        return (
                                            <motion.button
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.15 + sectionIndex * 0.05 + itemIndex * 0.03
                                                }}
                                                onClick={() => handleNavigate(item.label)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                                    isActive
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Icon size={20} />
                                                <span className="text-sm">{item.label}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}

export default Menu;