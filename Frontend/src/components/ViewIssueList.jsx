import React, {useEffect, useState} from "react";
import {SlidersHorizontal, Download, Frown, Loader2} from 'lucide-react';

import FilterAndSortPopUp from './FilterAndSortPopUp.jsx';
import ExportPopUp from './ExportPopUp';
import {IssueCard} from "./IssueCard.jsx";
import {CustomButton} from "./CustomButton.jsx";

function ViewIssueList({onViewIssue, initialBodyParams, pageName}) {
    // Variabili per la ricerca/visualizzazione di issue
    const MAX_VIEW_ISSUES = "15";
    const DEFAULT_SORT_TYPE = "CREATION_DATE_DESCENDING";

    // Stati per i parametri/ordinamento di ricerca
    const [bodyParams, setBodyParams] = useState(initialBodyParams);
    const [sortType, setSortType] = useState(DEFAULT_SORT_TYPE);

    // Stati per i popup
    const [isFilterAndSortPopUpOpen, setIsFilterAndSortPopUpOpen] = useState(false);
    const [isExportPopUpOpen, setIsExportPopUpOpen] = useState(false);

    // Stati per i dati e la paginazione
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Reimposta la pagina numero 1 in caso di modifica Filtri
    useEffect(() => {
        setCurrentPage(1);
    }, [JSON.stringify(bodyParams), sortType]);

    useEffect(() => {
        const fetchIssues = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            const payload = {
                pageNumber: (currentPage - 1).toString(),
                pageSize: MAX_VIEW_ISSUES,
                sortType: sortType,
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

                    setFilteredIssues(issueData.content || []);
                    setTotalPages(issueData.page.totalPages || 1);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssues(bodyParams);
    }, [JSON.stringify(bodyParams), sortType, currentPage]);

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

                    <CustomButton
                        variant="secondary"
                        onClick={() => setIsFilterAndSortPopUpOpen(true)}
                    >
                        <SlidersHorizontal size={20}/>
                        Filtra e Ordina
                    </CustomButton>

                    <CustomButton
                        variant="secondary"
                        onClick={() => setIsExportPopUpOpen(true)}
                    >
                        <Download size={20}/>
                        Esporta
                    </CustomButton>

                </div>
            </div>

            {/* Contenitore Tabella */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Elenco Issue */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-gray-50/50 rounded-xl border-2 border-gray-200">
                        <Loader2 size={40} className="text-gray-200 animate-spin mb-4"/>
                        <p className="text-gray-500 font-medium animate-pulse">Caricamento issue in corso...</p>
                    </div>
                ) : (
                    <div>
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
                    </div>

                )}

                {/* Controlli paginazione */}
                {filteredIssues.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border-gray-200 sm:px-6 rounded-b-xl">
                        {/* Pulsanti per schermo piccolo (smartphone) */}
                        <div className="flex justify-between flex-1 sm:hidden">

                            <CustomButton
                                variant="secondary"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Precedente
                            </CustomButton>
                            <div>
                                <p className="text-sm p-2 text-gray-700">
                                    Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <CustomButton
                                variant="secondary"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Successiva
                            </CustomButton>
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
                                    <CustomButton
                                        variant="secondary"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        Precedente
                                    </CustomButton>
                                    <CustomButton
                                        variant="secondary"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        Successiva
                                    </CustomButton>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FilterAndSortPopUp
                isOpen={isFilterAndSortPopUpOpen}
                onClose={() => setIsFilterAndSortPopUpOpen(false)}
                onApplyFilters={(newFilters, newSort) => {
                    // Verifica presenza di modifiche nei filtri/ordinamento
                    const areIdenticalFilters = JSON.stringify(newFilters) === JSON.stringify(bodyParams);
                    const isIdenticalSort = newSort === sortType;

                    if (areIdenticalFilters && isIdenticalSort) {
                        return;
                    }
                    setBodyParams(newFilters)
                    setSortType(newSort)
                }}
            />
            <ExportPopUp isOpen={isExportPopUpOpen} onClose={() => setIsExportPopUpOpen(false)}/>
        </div>
    );
}

export default ViewIssueList;