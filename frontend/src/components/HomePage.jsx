import React from "react";

function HomePage({onViewIssue}){
    const myIssues = [
        { id: 1, title: 'Implementare sistema di notifiche', status: 'In Progress', priority: 'Alta', completedAt: null },
        { id: 2, title: 'Ottimizzare query database', status: 'Completato', priority: 'Media', completedAt: '2026-03-28' },
        { id: 3, title: 'Fix bug login mobile', status: 'Completato', priority: 'Alta', completedAt: '2026-03-25' },
        { id: 4, title: 'Aggiornare documentazione API', status: 'Aperto', priority: 'Bassa', completedAt: null },
        { id: 5, title: 'Implementare dark mode', status: 'Completato', priority: 'Media', completedAt: '2026-03-20' },
    ];

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'Alta': return 'bg-red-50 text-red-700 border-red-100';
            case 'Media': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'Bassa': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Home</h2>
                    <p className="text-gray-600">Benvenuto nella tua area di lavoro</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Recenti</h3>

                    <div className="space-y-3">
                        {myIssues.map((issue) => (
                            <div
                                key={issue.id}
                                onClick={() => onViewIssue(issue.id)}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">

                                        {/* Sostituzione icone con pallini colorati o emoji */}
                                        <div className="mt-1">
                                            {issue.status === 'Completato' && (
                                                <span className="flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" title="Completato"></span>
                                            )}
                                            {issue.status === 'In Progress' && (
                                                <span className="flex h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" title="In Progress"></span>
                                            ) }
                                            {issue.status === 'Aperto' && (
                                                <span className="flex h-3 w-3 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.5)]" title="Aperto"></span>
                                            ) }
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                                                {issue.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Badge Stato (Testuale) */}
                                        <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                                            {issue.status}
                                        </span>

                                        {/* Badge Priorità */}
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${getPriorityStyle(issue.priority)}`}>
                                            {issue.priority}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );


}

export default HomePage;