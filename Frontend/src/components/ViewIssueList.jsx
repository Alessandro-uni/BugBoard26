import React, {useEffect, useState} from "react";
import {SlidersHorizontal, Download, Frown} from 'lucide-react';

import FilterAndSortPopUp from './FilterAndSortPopUp.jsx';
import ExportPopUp from './ExportPopUp';
import {Button} from "./Button.jsx";
import {IssueCard} from "./IssueCard.jsx";

function ViewIssueList({onViewIssue, bodyParams, pageName}) {
    // Stati per i popup
    const [isFilterAndSortPopUpOpen, setIsFilterAndSortPopUpOpen] = useState(false);
    const [isExportPopUpOpen, setIsExportPopUpOpen] = useState(false);

    // Stati per i dati e la paginazione
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Variabili per la ricerca/visualizzazione di issue
    const MAX_VIEW_ISSUES = "15";
    const DEFAULT_SORT_TYPE = "CREATION_DATE_DESCENDING";

    // Reimposta la pagina numero 1 in caso di modifica Filtri
    useEffect(() => {
        setCurrentPage(1);
    }, [JSON.stringify(bodyParams)]);

    useEffect(() => {
        const fetchIssues = async () => {
            const token = localStorage.getItem('token');

            const payload = {
                pageNumber: (currentPage - 1).toString(),
                pageSize: MAX_VIEW_ISSUES,
                sortType: DEFAULT_SORT_TYPE,
                filters: {
                    ...bodyParams
                }
            };

            try {
                const response = await fetch('http://localhost:8080/api/issues/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const issueData = await response.json();

                    const issuesArray = issueData.content || [];

                    setFilteredIssues(issuesArray);
                    setTotalPages(issueData.page.totalPages || 1);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchIssues(bodyParams);
    }, [JSON.stringify(bodyParams), currentPage]);

    // Funzioni di supporto

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }

    return (
        <div className="w-full mx-auto">
            {/* Intestazione */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{pageName}</h2>
                <p className="text-gray-600">Filtra e ordina le Issue</p>
            </div>

            {/* Barra degli strumenti (Buttons : Filtri/Ordina/Esporta) */}
            <div className="px-4 pb-4 border-gray-200">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                    <Button
                        onClick={() => setIsFilterAndSortPopUpOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <SlidersHorizontal size={20} />
                        Filtra e Ordina
                    </Button>

                    <Button
                        onClick={() => setIsExportPopUpOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Download size={20} />
                        Esporta
                    </Button>

                </div>
            </div>

            {/* Contenitore Tabella */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Elenco Issue */}
                {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                            <Frown size={32} className="text-gray-400"/>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nessuna issue trovata</h3>
                        <p className="text-gray-500 max-w-sm">
                            Non ci sono risultati in questa sezione. Provare a modificare i filtri
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-xl border-2 border-dashed border-gray-200">
                        {filteredIssues.map((issue) => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                onClick={() => onViewIssue(issue.id)}
                                className="min-h-35"
                            >
                            </IssueCard>
                        ))}
                    </div>
                )}

                {/* Controlli paginazione */}
                {filteredIssues.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border-gray-200 sm:px-6 rounded-b-xl">
                        {/* Pulsanti per schermo piccolo (smartphone) */}
                        <div className="flex justify-between flex-1 sm:hidden">

                            <Button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Precedente
                            </Button>
                            <div>
                                <p className="text-sm p-2 text-gray-700">
                                    Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Successiva
                            </Button>
                        </div>

                        {/* Pulsanti per schermo grande (computer) */}
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>

                            <div>
                                <nav className="relative z-0 inline-flex rounded-md space-x-2">
                                    <Button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Precedente
                                    </Button>
                                    <Button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Successiva
                                    </Button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FilterAndSortPopUp isOpen={isFilterAndSortPopUpOpen} onClose={() => setIsFilterAndSortPopUpOpen(false)}/>
            <ExportPopUp isOpen={isExportPopUpOpen} onClose={() => setIsExportPopUpOpen(false)}/>
        </div>
    );
}

export default ViewIssueList;