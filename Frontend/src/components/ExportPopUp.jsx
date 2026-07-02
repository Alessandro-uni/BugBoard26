import React, {useState} from "react";
import {X, Download, Table, Loader2} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";
import {API_BASE_URL} from "../apiConfig.js";

function ExportPopUp({isOpen, onClose, curretFilters, sortType}){
    const [isLoading, setIsLoading] = useState(false);
    const [detailLevel, setDetailLevel] = useState("MEDIUM");

    if(!isOpen) return null;

    const handleExport = async (format) => {
        setIsLoading(true);
        const token = sessionStorage.getItem('token');

        const payload = {
            detailLevel: detailLevel,
            issuePageRequest: {
                pageInformation: {
                    pageNumber: "0",
                    pageSize: "1000"
                },
                sortType: sortType,
                filters: {
                    ...curretFilters
                }
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/issues/export${format}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = globalThis.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;

                const fileExtension = format.toLowerCase();
                a.download = `Issues_Export_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
                document.body.appendChild(a);
                a.click();

                a.remove();
                globalThis.URL.revokeObjectURL(url);
                onClose();
            } else {
                const errorText = await response.text();
                alert("Errore durante l'esportazione: " + errorText);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            alert('Errore: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">

            {/* Overlay */}
            <button
                className="absolute inset-0 bg-black/50"
                onClick={isLoading ? undefined : onClose}
            />

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
                        disabled={isLoading}
                    >
                        <X size={20}/>
                    </CustomButton>
                </div>

                {/* Opzioni di esportazione */}
                <div className="space-y-3">
                    {/* Selezione dettaglio di esportazione */}
                    <div>
                        <label htmlFor="detailLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Livello di dettaglio
                        </label>
                        <select
                            id="detailLevel"
                            value={detailLevel}
                            onChange={(e) => setDetailLevel(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="LOW">Basso (Campi principali)</option>
                            <option value="MEDIUM">Medio (Dati standard)</option>
                            <option value="HIGH">Alto (Tutti i dettagli)</option>
                        </select>
                    </div>

                    {/* Selezione formato */}
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Seleziona il formato di esportazione:
                        </p>
                        {/* Opzione CSV */}
                        <button
                            onClick={() => handleExport('CSV')}
                            disabled={isLoading}
                            className={`w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group ${
                                isLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                        >
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 text-green-600 dark:text-green-400 animate-spin" />
                                ) : (
                                    <Table className="w-6 h-6 text-green-600 dark:text-green-400"/>
                                )}
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {isLoading ? 'Esportazione in corso' : 'CSV'}
                                </h3>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Pulsante annulla */}
                <div className="flex justify-end pt-4">
                    <CustomButton
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Annulla
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}

export default ExportPopUp;