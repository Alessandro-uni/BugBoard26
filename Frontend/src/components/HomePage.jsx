import React, {useEffect, useState} from "react";
import {Badge} from "./Badge.jsx";

function IssueSection({title, issues, onViewIssue}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            {issues.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessuna issue in questa sezione</p>
            ) : (
                <div className="space-y-3">
                    {issues.map((issue) => (
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
    );
}

function HomePage({onViewIssue, currentUserId, userName, userRole = 'LURKER'}){
    const [allIssues, setAllIssues] = useState([]);
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [reportedIssues, setReportedIssues] = useState([]);

    // Fetch issue todo: fare la ricerca limitata ai primi 3 risultati
    useEffect(() => {
        const fetchIssueGroup = async (bodyParams) => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/issues/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyParams)
            });

            if (!response.ok) {
                const errorJson = await response.json();
                throw new Error(errorJson.message || "Errore nel caricamento delle issue");
            }

            const data = await response.json();
            return data.map(item => ({
                id: item.id,
                title: item.title,
                status: item.status,
                priority: item.priority
            }));
        };

        const fetchAllData = async () => {
            try {
                const [allData, assignedData, reportedData] = await Promise.all([
                    fetchIssueGroup({}),
                    fetchIssueGroup({assignedUserId: currentUserId}),
                    fetchIssueGroup({reportingUserId: currentUserId})
                ]);

                setAllIssues(allData);
                setAssignedIssues(assignedData);
                setReportedIssues(reportedData);
            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        if (currentUserId) {
            fetchAllData();
        }
    }, [currentUserId]);

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Home</h2>
                    <p className="text-gray-600">Ciao, {userName}. Benvenutə nella tua area di lavoro</p>
                </div>

                <div className="space-y-6">
                    <IssueSection
                        title="Tutte le issue"
                        issues={allIssues}
                        onViewIssue={onViewIssue}
                    />

                    {['USER', 'ADMIN'].includes(userRole) && (
                        <>
                            <IssueSection
                                title="Issue assegnate"
                                issues={assignedIssues}
                                onViewIssue={onViewIssue}
                            />
                            <IssueSection
                                title="Issue segnalate"
                                issues={reportedIssues}
                                onViewIssue={onViewIssue}
                            />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default HomePage;