import React from "react";
import { X, Filter } from 'lucide-react';


function FilterPopUp({isOpen,onClose}){

    if(!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        alert('Filtri applicati!');
        onClose();
    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay*/}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />


            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">

                {/* Header*/}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200 z-10">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Filter size={20} />
                        Filtri
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form id="filterForm" onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stato */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Stato
                            </label>
                            <select
                                id="status"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Nessuno stato selezionato</option>
                                <option value="TODO">Da svolgere</option>
                                <option value="INPROGRESS">In lavorazione</option>
                                <option value="RESOLVED">Risolta</option>
                                <option value="CLOSED">Chiusa</option>
                            </select>
                        </div>

                        {/* Tipologia */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                Tipologia
                            </label>
                            <select
                                id="type"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Nessuna tipologia selezionata</option>
                                <option value="BUG">Bug</option>
                                <option value="QUESTION">Domanda</option>
                                <option value="DOCUMENTATION">Documentazione</option>
                                <option value="FEATURE">Funzionalità</option>
                            </select>
                        </div>

                        {/* Utente Segnalatore */}
                        <div>
                            <label htmlFor="reportUser" className="block text-sm font-medium text-gray-700 mb-2">
                                Creato da
                            </label>
                            <select
                                id="reportUser"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Nessun utente selezionato</option>
                                <option value="marco">Marco Rossi</option>
                                <option value="laura">Laura Bianchi</option>
                                <option value="giuseppe">Giuseppe Verdi</option>
                            </select>
                        </div>

                        {/* Utente Assegnato */}
                        <div>
                            <label htmlFor="assignedUser" className="block text-sm font-medium text-gray-700 mb-2">
                                Assegnato a
                            </label>
                            <select
                                id="assignedUser"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Nessun utente selezionato</option>
                                <option value="marco">Marco Rossi</option>
                                <option value="laura">Laura Bianchi</option>
                                <option value="giuseppe">Giuseppe Verdi</option>
                            </select>
                        </div>

                        {/* Tag */}
                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                                Tag
                            </label>
                            <select
                                id="tag"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Tutti</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="database">Database</option>
                                <option value="ui-ux">UI/UX</option>
                                <option value="performance">Performance</option>
                                <option value="security">Security</option>
                                <option value="testing">Testing</option>
                            </select>
                        </div>

                        {/* Priorità */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priorità
                            </label>
                            <input
                                type="checkbox"
                                id="priority"
                                className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Sezione Date: Creazione */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Creazione</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="creationDateStart" className="block text-sm font-medium text-gray-700 mb-2">
                                    Da:
                                </label>
                                <input
                                    type="date"
                                    id="creationDateStart"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="creationDateEnd" className="block text-sm font-medium text-gray-700 mb-2">
                                    A:
                                </label>
                                <input
                                    type="date"
                                    id="creationDateEnd"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sezione Date: Modifica */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Ultima Modifica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="modifiedDateStart" className="block text-sm font-medium text-gray-700 mb-2">
                                    Da:
                                </label>
                                <input
                                    type="date"
                                    id="modifiedDateStart"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="modifiedDateEnd" className="block text-sm font-medium text-gray-700 mb-2">
                                    A:
                                </label>
                                <input
                                    type="date"
                                    id="modifiedDateEnd"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pulsanti */}
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Applica
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        </div>



    );


}

export default FilterPopUp;