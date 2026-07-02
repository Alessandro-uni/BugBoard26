import React, {useEffect, useState} from "react";
import {IssueCard} from "./IssueCard.jsx";
import {ReloadingBox} from "./ReloadingBox.jsx";
import {API_BASE_URL} from "../apiConfig.js";
import {CustomButton} from "./CustomButton.jsx";
import {Bell, X} from "lucide-react";

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
    // Sezione issues

    const [allIssues, setAllIssues] = useState([]);
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [reportedIssues, setReportedIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const MAX_HOME_ISSUES = 3;

    // Fetch issues
    useEffect(() => {
        const fetchIssueGroup = async (bodyParams) => {
            const token = sessionStorage.getItem('token');
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
            void fetchAllData();
        }
    }, [currentUserId]);

    // Sezione notifiche

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState(null);

    // Fetch notifiche
    useEffect(() => {
        const fetchNotifications = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/notification`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const notificationsData = await response.json();
                    setNotifications(notificationsData);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchNotifications();
    }, []);

    // Rimozione singola notifica
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleRemoveNotification = async (e) => {
        e.preventDefault();

        if (!selectedNotificationId) {
            return;
        }

        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/api/notification/read/${selectedNotificationId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                removeNotification(selectedNotificationId);
                setSelectedNotificationId(null);
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:" , error);
            alert('Errore: ' + error.message);
        }
    }

    // Rimozione tutte le notifiche

    const handleRemoveAllNotifications = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/api/notification/readAll`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                setNotifications([]);
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:" , error);
            alert('Errore: ' + error.message);
        }
    }

    return (
        <div className="w-full mx-auto">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Home
                    </h2>

                    {/* 1. Notifiche */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <CustomButton
                                variant="secondary"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={24} className="text-gray-900 dark:text-white"/>
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </CustomButton>

                            {/* Dropdown Notifiche */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                Notifiche
                                            </h3>
                                        </div>

                                        {/* Pulsante di chiusura e rimozione di tutte le notifiche */}
                                        <CustomButton
                                            variant="secondary"
                                            onClick={(e) => {handleRemoveAllNotifications(e)}}
                                        >
                                            segna tutte come lette
                                        </CustomButton>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Nessuna notifica</div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => onViewIssue(notification.idIssue)}
                                                    className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start justify-between gap-3 hover:cursor-pointer"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {new Date(notification.date).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    {/* Pulsante di chiusura e rimozione notifica */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedNotificationId(notification.id);
                                                            handleRemoveNotification(e);
                                                        }}
                                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:cursor-pointer"
                                                    >
                                                        <X size={16}/>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                    Ciao {userName}. Benvenutə nella tua area di lavoro
                </p>
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