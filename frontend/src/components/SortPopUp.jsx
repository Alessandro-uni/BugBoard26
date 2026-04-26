import React from "react";
import { X, ArrowUpDown } from 'lucide-react';

function SortPopUp({isOpen, onClose}){

    if(!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Contenitore */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">

                {/* Header d */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ArrowUpDown size={20} />
                        Ordina Issues
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form di Ordinamento */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                            Ordina per
                        </label>
                        <select
                            id="sortBy"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                        >
                            <option value="creationDate">Data Creazione</option>
                            <option value="lastModified">Data Ultima Modifica</option>
                            <option value="priority">Priorità</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                            Ordine
                        </label>
                        <select
                            id="sortOrder"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                        >
                            <option value="asc">Crescente</option>
                            <option value="desc">Decrescente</option>
                        </select>
                    </div>

                    {/* Pulsanti*/}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Applica
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annulla
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );

}
export default SortPopUp;