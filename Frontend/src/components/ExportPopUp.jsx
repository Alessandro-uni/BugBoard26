import React from "react";
import { X, Download, FileText, Table } from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";

function ExportPopUp({isOpen, onClose}){


    if(!isOpen) return null;

    const handleExport = (format) => {

        alert(`Esportazione in formato ${format} avviata!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay*/}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Contenitore della Modale */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">

                {/* Intestazione */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Download size={20} />
                        Esporta Issues
                    </h2>
                    <CustomButton
                        variant="secondary"
                        onClick={onClose}
                    >
                        <X size={20}/>
                    </CustomButton>
                </div>

                {/* Opzioni di Esportazione */}
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Seleziona il formato di esportazione:</p>

                    {/* Opzione 1 */}
                    <button
                        onClick={() => handleExport('PDF')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                            <FileText className="w-6 h-6 text-red-600 dark:text-red-400"/>
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">PDF</h3>
                        </div>
                    </button>

                    {/* Opzione 2 */}
                    <button
                        onClick={() => handleExport('CSV')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            <Table className="w-6 h-6 text-green-600 dark:text-green-400"/>
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">CSV</h3>
                        </div>
                    </button>

                    {/* Opzione 3 */}
                    <button
                        onClick={() => handleExport('Excel')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                            <Table className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Excel</h3>
                        </div>
                    </button>
                </div>

                {/* Pulsante annulla */}
                <div className="flex justify-end pt-4">
                    <CustomButton
                        variant="secondary"
                        onClick={onClose}
                    >
                        Annulla
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}

export default ExportPopUp;