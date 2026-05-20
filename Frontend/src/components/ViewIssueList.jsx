import React, {useEffect, useState} from "react";
import { Filter, ArrowUpDown, Download } from 'lucide-react';

import SortPopUp from './SortPopUp';
import FilterPopUp from './FilterPopUp';
import ExportPopUp from './ExportPopUp';
import {Badge} from "./Badge.jsx";

function ViewIssueList({onViewIssue, bodyParams, pageName}) {
    //stati per i popup
    const [isSortPopUpOpen, setIsSortPopUplOpen] = useState(false);
    const [isExportPopUpOpen, setIsExportPopUpOpen] = useState(false);
    const [isFilterPopUpOpen, setIsFilterPopUpOpen] = useState(false);

    const [filteredIssues, setFilteredIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async (bodyParams) => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/api/issues/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bodyParams)
                });

                if (response.ok) {
                    const issueData = await response.json();
                    setFilteredIssues(issueData);
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
    }, [JSON.stringify(bodyParams)]);

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

                        <button
                            onClick={() => setIsFilterPopUpOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={20} />
                            Filtra
                        </button>

                        <button
                            onClick={() => setIsSortPopUplOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ArrowUpDown size={20} />
                            Ordina
                        </button>

                        <button
                            onClick={() => setIsExportPopUpOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Download size={20} />
                            Esporta
                        </button>

                    </div>
                </div>

                {/* Contenitore Tabella */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Elenco Issue  */}
                    {filteredIssues.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nessuna issue in questa sezione</p>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    onClick={() => onViewIssue(issue.id)}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
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
                </div>
            </div>

            <SortPopUp isOpen={isSortPopUpOpen} onClose={() => setIsSortPopUplOpen(false)} />
            <ExportPopUp isOpen={isExportPopUpOpen} onClose={() => setIsExportPopUpOpen(false)} />
            <FilterPopUp isOpen={isFilterPopUpOpen} onClose={() => setIsFilterPopUpOpen(false)} />
        </div>
    );
}

export default ViewIssueList;