import React from "react";
import {List, PlusCircle, UserPlus, ClipboardList, KeyRound, LogOut, X, ListTodo, ListCollapse} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {CustomButton} from "./CustomButton.jsx";

function Menu({currentPage, onNavigate, isOpen, onClose, userRole = 'LURKER', userPermissions = []}) {

    // Configurazione del menu
    const menuSections = [
        {
            title: 'Principale',
            requiredPermission: null,
            items: [
                { icon: List, label: 'Tutte le issue', requiredPermission: null },
                { icon: ListTodo, label: 'Issue assegnate', requiredPermission: 'BE_ASSIGNED_TO_ISSUE' },
                { icon: ListCollapse, label: 'Issue segnalate', requiredPermission: 'REPORT_ISSUE' },
                { icon: PlusCircle, label: 'Segnala Issue', requiredPermission: 'REPORT_ISSUE' },
            ]
        },
        {
            title: 'Gestione',
            requiredPermission: null,
            items: [
                { icon: ClipboardList, label: 'Assegna Issue', requiredPermission: 'ASSIGN_ISSUE' },
                { icon: UserPlus, label: 'Aggiungi nuovo utente', requiredPermission: 'CREATE_USERS' },
            ]
        },
        {
            title: 'Account',
            requiredPermission: null,
            items: [
                { icon: KeyRound, label: 'Cambia password', requiredPermission: null },
                { icon: LogOut, label: 'Esci', requiredPermission: null },
            ]
        }
    ];

    // Filtraggio menu
    const filteredMenu = menuSections
        .filter(section => {
            return !section.requiredPermission || userPermissions.includes(section.requiredPermission);
        })
        .map(section => ({
            ...section,
            items: section.items.filter(item => {
                return !item.requiredPermission || userPermissions.includes(item.requiredPermission);
            })
        }))
        .filter(section => section.items.length > 0);

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
                        className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-40 flex flex-col transition-colors"
                    >

                        {/* Pulsante X che chiude il menu */}
                        <div className="p-6 pt-20">
                            <CustomButton
                                variant="secondary"
                                onClick={onClose}
                                className="absolute top-4 right-4">
                                <X size={24} className="dark:text-white"/>
                            </CustomButton>

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
                            <p className="text-xs text-blue-900 mt-1 dark:text-blue-300">{userRole}</p>
                        </div>

                        {/* Navigazione */}
                        <nav className="flex-1 px-4 overflow-y-auto">
                            {filteredMenu.map((section, sectionIndex) => (
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
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer'
                                                }`}
                                            >
                                                <Icon size={20}/>
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