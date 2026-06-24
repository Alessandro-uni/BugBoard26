import React, {useEffect, useState} from "react";
import {IssueCard} from "./IssueCard.jsx";
import {ReloadingBox} from "./ReloadingBox.jsx";
import {API_BASE_URL} from "../apiConfig.js";

function IssueSection({title, issues, onViewIssue, onViewAll}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">

            {/* Intestazione sezione */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>

                <button
                    onClick={onViewAll}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                    Vedi tutte &rarr;
                </button>
            </div>

            {issues.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Nessuna issue in questa sezione</p>
            ) : (
                <div className="flex flex-row gap-5 overflow-x-auto">
                    {issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={() => onViewIssue(issue.id)}
                            className="shrink-0 w-21.25 sm:w-110 my-2"
                        >
                        </IssueCard>
                    ))}
                </div>
            )}
        </div>
    );
}

function HomePage({onViewIssue, currentUserId, userName, userPermissions = [], onNavigation}){
    const [allIssues, setAllIssues] = useState([]);
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [reportedIssues, setReportedIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const MAX_HOME_ISSUES = 3;

    useEffect(() => {
        const fetchIssueGroup = async (bodyParams) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/issues/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bodyParams)
            });

            if (!response.ok) {
                const errorJson = await response.json();
                throw new Error(errorJson.message || "Errore nel caricamento delle issue");
            }

            const data = await response.json();

            const issuesArray = data.content || [];

            return issuesArray.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
                type: item.type,
                priority: item.priority
            }));
        };

        const fetchAllData = async () => {
            setIsLoading(true);

            try {
                const [allData, assignedData, reportedData] = await Promise.all([
                    fetchIssueGroup({pageInformation: {pageNumber: 0, pageSize: MAX_HOME_ISSUES}}),
                    fetchIssueGroup({pageInformation: {pageNumber: 0, pageSize: MAX_HOME_ISSUES}, filters: {assignedUserId: currentUserId}}),
                    fetchIssueGroup({pageInformation: {pageNumber: 0, pageSize: MAX_HOME_ISSUES}, filters: {reportingUserId: currentUserId}})
                ]);

                setAllIssues(allData);
                setAssignedIssues(assignedData);
                setReportedIssues(reportedData);
            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUserId) {
            fetchAllData();
        }
    }, [currentUserId]);

    return (
        <div className="w-full mx-auto">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Home</h2>
                <p className="text-gray-600 dark:text-gray-400">Ciao, {userName}. Benvenutə nella tua area di lavoro</p>
            </div>

            {isLoading ? (
                <ReloadingBox description='Caricamento issue in corso...'></ReloadingBox>
            ) : (
                <div>
                    <div className="space-y-6 mx-auto">
                        <IssueSection
                            title="Tutte le issue"
                            issues={allIssues}
                            onViewIssue={onViewIssue}
                            onViewAll={() => onNavigation('Tutte le issue')}
                        />

                        {userPermissions.includes('BE_ASSIGNED_TO_ISSUE') && (
                            <IssueSection
                                title="Issue assegnate"
                                issues={assignedIssues}
                                onViewIssue={onViewIssue}
                                onViewAll={() => onNavigation('Issue assegnate')}
                            />
                        )}

                        {userPermissions.includes('REPORT_ISSUE') && (
                            <IssueSection
                                title="Issue segnalate"
                                issues={reportedIssues}
                                onViewIssue={onViewIssue}
                                onViewAll={() => onNavigation('Issue segnalate')}
                            />
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;