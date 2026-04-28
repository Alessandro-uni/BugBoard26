import React, { useState } from "react";
import { Paperclip, Tag, UserPlus, X} from "lucide-react";

function ViewSingleIssue({ issueData, onAssignIssue }) {

    const [title, setTitle] = useState(issueData?.title || "");
    const [description, setDescription] = useState(issueData?.description || "");

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Aperto': return 'bg-red-100 text-red-700 border-red-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Chiuso': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {/* Stato */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(issueData?.status)}`}>
                                {issueData?.status || 'Stato'}
                            </span>
                            {/* Tipo */}
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                {issueData?.type || 'Bug'}
                            </span>
                            {/* Priorità */}
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                Priorità: {issueData?.priority || 'Media'}
                            </span>
                        </div>

                        {/* Tag */}
                        <div className="flex items-center gap-2 text-gray-500">
                            <Tag size={16} />
                            <div className="flex gap-2">
                                {['Frontend', 'Urgent'].map(tag => (
                                    <span key={tag} className="text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tasto Assegna */}
                    <button
                        onClick={() => onAssignIssue(issueData?.id)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                    >
                        <UserPlus size={18} />
                        Assegna Issue
                    </button>
                </div>

                {/* CARD  */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Dettagli Issue</h3>

                        <div className="space-y-6">
                            {/* Titolo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                    Titolo
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium"
                                />
                            </div>

                            {/* Descrizione */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                    Descrizione
                                </label>
                                <textarea
                                    rows="6"
                                    value={description}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 resize-none"
                                />
                            </div>

                            {/* Allegati */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                                    <Paperclip size={16} />
                                    <span>Visualizza allegati (2 file)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSingleIssue;