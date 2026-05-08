import React from "react";
import { X, Download, FileText, Table } from 'lucide-react';

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
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">

                {/* Intestazione */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Download size={20} />
                        Esporta Issues
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Opzioni di Esportazione */}
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">Seleziona il formato di esportazione:</p>

                    {/* Opzione 1 */}
                    <button
                        onClick={() => handleExport('PDF')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900">PDF</h3>
                        </div>
                    </button>

                    {/* Opzione 2 */}
                    <button
                        onClick={() => handleExport('CSV')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <Table className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900">CSV</h3>
                        </div>
                    </button>

                    {/* Opzione 3 */}
                    <button
                        onClick={() => handleExport('Excel')}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Table className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-900">Excel</h3>
                        </div>
                    </button>
                </div>

                {/* Pulsante */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Annulla
                </button>
            </div>
        </div>


    );
}

export default ExportPopUp;