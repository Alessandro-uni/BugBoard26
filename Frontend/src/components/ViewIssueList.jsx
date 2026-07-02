import React, {useEffect, useState} from "react";
import {SlidersHorizontal, Download, Frown} from 'lucide-react';

import FilterAndSortPopUp from './FilterAndSortPopUp.jsx';
import ExportPopUp from './ExportPopUp';
import {IssueCard} from "./IssueCard.jsx";
import {CustomButton} from "./CustomButton.jsx";
import {ReloadingBox} from "./ReloadingBox.jsx";
import {API_BASE_URL} from "../apiConfig.js";

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
        const fetchIssues = async (bodyParams) => {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');

            const payload = {
                pageInformation: {
                    pageNumber: (currentPage - 1).toString(),
                    pageSize: MAX_VIEW_ISSUES
                },
                sortType: sortType,
                filters: {
                    ...bodyParams
                }
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/issues/search`, {
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

        void fetchIssues(bodyParams);
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{pageName}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Filtra e ordina le Issue</p>
            </div>

            {/* Barra degli strumenti (Buttons : Filtri/Ordina/Esporta) */}
            <div className="px-4 pb-4   dark:border-gray-700  ">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
                {/* Elenco Issue */}
                {isLoading ? (
                    <ReloadingBox description='Caricamento issue in corso...'></ReloadingBox>
                ) : (
                    <div>
                        {filteredIssues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full shadow-sm mb-4">
                                    <Frown size={32} className="text-gray-400 dark:text-gray-500"/>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nessuna issue trovata</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    Non ci sono risultati in questa sezione. Provare a modificare i filtri
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
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
                    <div className="flex items-center justify-between px-4 py-3 mt-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 sm:px-6">
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
                                <p className="text-sm p-2 text-gray-700 dark:text-gray-300">
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
                                <p className="text-sm text-gray-700 dark:text-gray-300">
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
                currentFilters={bodyParams}
                lockedFilters={initialBodyParams}
                onApplyFilters={(newFilters, newSort) => {
                    // Unione filtri della pagina con quelli richiesti nel PopUp
                    const mergedFilters = {
                        ...initialBodyParams,
                        ...newFilters
                    };

                    // Verifica presenza di modifiche nei filtri/ordinamento
                    const areIdenticalFilters = JSON.stringify(mergedFilters) === JSON.stringify(bodyParams);
                    const isIdenticalSort = newSort === sortType;

                    if (areIdenticalFilters && isIdenticalSort) {
                        return;
                    }

                    setBodyParams(mergedFilters);
                    setSortType(newSort);
                }}
            />
            <ExportPopUp
                isOpen={isExportPopUpOpen}
                onClose={() => setIsExportPopUpOpen(false)}
                curretFilters={bodyParams}
                sortType={sortType}
            />
        </div>
    );
}

export default ViewIssueList;