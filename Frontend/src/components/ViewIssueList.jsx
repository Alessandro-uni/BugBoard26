import React, {useEffect, useState} from "react";
import { Filter, ArrowUpDown, Download, Frown } from 'lucide-react';

import SortPopUp from './SortPopUp';
import FilterPopUp from './FilterPopUp';
import ExportPopUp from './ExportPopUp';
import {Badge} from "./Badge.jsx";
import {Button} from "./Button.jsx";

function ViewIssueList({onViewIssue, bodyParams, pageName}) {
    // Stati per i popup
    const [isSortPopUpOpen, setIsSortPopUpOpen] = useState(false);
    const [isExportPopUpOpen, setIsExportPopUpOpen] = useState(false);
    const [isFilterPopUpOpen, setIsFilterPopUpOpen] = useState(false);

    // Stati per i dati e la paginazione
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Reimposta la pagina numero 1 in caso di modifica Filtri
    useEffect(() => {
        setCurrentPage(1);
    }, [JSON.stringify(bodyParams)]);

    useEffect(() => {
        const fetchIssues = async () => {
            const token = localStorage.getItem('token');

            const payload = {
                ...bodyParams,
                pageNumber: currentPage - 1,
                pageSize: 10
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
                    setTotalPages(issueData.totalPages || 1);
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
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Intestazione */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{pageName}</h2>
                    <p className="text-gray-600">Filtra e ordina le Issue</p>
                </div>

                {/* Barra degli strumenti (Buttons : Filtri/Ordina/Esporta) */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                        <Button
                            onClick={() => setIsFilterPopUpOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={20} />
                            Filtra
                        </Button>

                        <Button
                            onClick={() => setIsSortPopUpOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ArrowUpDown size={20} />
                            Ordina
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
                <div className="bg-white rounded-xl shadow-sm">
                    {/* Elenco Issue */}
                    {filteredIssues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 m-4">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                                <Frown size={32} className="text-gray-400"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nessuna issue trovata</h3>
                            <p className="text-gray-500 max-w-sm">
                                Non ci sono risultati in questa sezione. Provare a modificare i filtri.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    onClick={() => onViewIssue(issue.id)}
                                    className="group p-5 border border-transparent border-gray-100 hover:bg-gray-200 hover:shadow-md hover:translate-y-0.5 bg-white transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                    {issue.title}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant={issue.status}>
                                                {issue.status}
                                            </Badge>
                                            {issue.priority && (
                                                <Badge variant="priority">
                                                    Priorità
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Controlli paginazione */}
                    {filteredIssues.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 rounded-b-xl">
                            <div className="flex justify-between flex-1 sm:hidden">
                                <Button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Precedente
                                </Button>
                                <Button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Successiva
                                </Button>
                            </div>

                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>

                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <Button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </div>

            <SortPopUp isOpen={isSortPopUpOpen} onClose={() => setIsSortPopUpOpen(false)} />
            <ExportPopUp isOpen={isExportPopUpOpen} onClose={() => setIsExportPopUpOpen(false)} />
            <FilterPopUp isOpen={isFilterPopUpOpen} onClose={() => setIsFilterPopUpOpen(false)} />
        </div>
    );
}

export default ViewIssueList;