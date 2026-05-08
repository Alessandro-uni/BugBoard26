import {useState} from "react";
import { Filter, ArrowUpDown, Download } from 'lucide-react';

import SortPopUp from './SortPopUp';
import FilterPopUp from './FilterPopUp';
import ExportPopUp from './ExportPopUp';


function ViewIssueList({ onViewIssue }) {
    //stati per i popup
    const [isSortPopUpOpen, setIsSortPopUplOpen] = useState(false);
    const [isExportPopUpOpen, setIsExportPopUpOpen] = useState(false);
    const [isFilterPopUpOpen, setIsFilterPopUpOpen] = useState(false);

    //dati di esempio
    const issues = [
        { id: 1, title: 'Bug nel sistema di login', description: 'Gli utenti non riescono ad accedere', priority: 'Alta', status: 'Aperto', assignee: 'Marco Rossi', date: '2026-03-28' },
        { id: 2, title: 'Miglioramento UI Dashboard', description: 'Aggiornare il design della dashboard', priority: 'Media', status: 'In Progress', assignee: 'Laura Bianchi', date: '2026-03-27' },
        { id: 3, title: 'Errore nel caricamento dati', description: 'I dati non vengono caricati correttamente', priority: 'Alta', status: 'Aperto', assignee: 'Giuseppe Verdi', date: '2026-03-26' },
        { id: 4, title: 'Aggiungere esportazione PDF', description: 'Permettere export dei report in PDF', priority: 'Bassa', status: 'Chiuso', assignee: 'Anna Ferrari', date: '2026-03-25' },
        { id: 5, title: 'Ottimizzazione performance', description: 'Migliorare la velocità di caricamento', priority: 'Media', status: 'In Progress', assignee: 'Paolo Russo', date: '2026-03-24' },
    ];


    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Intestazione */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Tutte le Issues</h2>
                    <p className="text-gray-600">Visualizza e gestisci tutte le Issues</p>
                </div>

                {/* Barra degli Strumenti (Buttons : Filtri/Ordina/Esporta) */}
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
                    <div className="divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <div
                                key={issue.id}
                                onClick={() => onViewIssue(issue.id)}
                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                                                {issue.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>Assegnato a: <span className="font-medium text-gray-700">{issue.assignee}</span></span>
                                                <span>•</span>
                                                <span>{issue.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <SortPopUp isOpen={isSortPopUpOpen} onClose={() => setIsSortPopUplOpen(false)} />
            <ExportPopUp isOpen={isExportPopUpOpen} onClose={() => setIsExportPopUpOpen(false)} />
            <FilterPopUp isOpen={isFilterPopUpOpen} onClose={() => setIsFilterPopUpOpen(false)} />
        </div>
    );
}

export default ViewIssueList;