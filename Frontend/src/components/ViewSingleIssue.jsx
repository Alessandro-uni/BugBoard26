import React, {useCallback, useEffect, useState} from "react";
import {Paperclip, Tag, UserPlus, Search, Check, Info, AlertCircle, BookmarkX, Loader2} from "lucide-react";
import {CustomButton} from "./CustomButton.jsx";
import History from "./History.jsx";
import {ReloadingBox} from "./ReloadingBox.jsx";

function ViewSingleIssue({issueId, userPermissions = [], userId, onBack}) {
    // DOMINIO ISSUE

    const [issueData, setIssueData] = useState(null);
    const [isIssueLoading, setIsIssueLoading] = useState(true);
    const [issueError, setIssueError] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    // Fetch dettagli della issue
    const fetchIssueDetails = useCallback(async () => {
        setIssueError(null);
        setIsIssueLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            setIssueError("Autenticazione assente");
            setIsIssueLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/issues/${issueId}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                setIssueData(data);
            } else {
                const errorText = await response.text();
                let errorMessage = "Errore durante il caricamento della issue";

                try {
                    errorMessage = JSON.parse(errorText).message || errorMessage;
                } catch (error) {
                    console.log(`Errore durante il caricamento issue: ${error}`);
                }

                setIssueError(errorMessage);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            setIssueError("Impossibile connettersi al server");
        } finally {
            setIsIssueLoading(false);
        }
    }, [issueId]);

    // Caricamento iniziale dettagli della issue
    useEffect(() => {
        if (issueId) {
            fetchIssueDetails();
        }
    }, [issueId, fetchIssueDetails]);

    // DOMINIO UTENTI ASSEGNABILI

    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [isAssignSuccess, setIsAssignSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersError, setUsersError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isListUsersLoading, setIsListUsersLoading] = useState(true);

    // Fetch utenti
    const fetchAvailableUsers = useCallback(async () => {
        setUsersError(null);
        setIsListUsersLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            setUsersError("Autenticazione assente");
            setIsListUsersLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/available", {
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                const errorText = await response.text();
                let errorMessage = "Errore durante il caricamento degli utenti";

                try {
                    errorMessage = JSON.parse(errorText).message || errorMessage;
                } catch (error) {
                    console.log(`Errore durante il caricamento utenti: ${error}`);
                }

                setUsersError(errorMessage);
            }
        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            setUserError("Impossibile connettersi al server");
        } finally {
            setIsListUsersLoading(false);
        }
    }, []);

    // Caricamento utenti disponibili quando richiesti
    useEffect(() => {
        if (showAssignPopup) {
            fetchAvailableUsers();
        }
    }, [showAssignPopup, fetchAvailableUsers]);

    // Filtro utenti
    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignConfirm = async () => {
        if (!selectedUser) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/issues/assign`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({issueId: issueData?.id, userId: selectedUser.id}),
            });

            if (response.ok) {
                setIsAssignSuccess(true);
            } else {
                alert("Errore durante l'assegnazione");
            }

        } catch (err) {
            console.error("Errore:", err);
        }
    };

    // DOMINIO UTENTE ASSEGNATO

    const [assignedUser, setAssignedUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [userError, setUserError] = useState(null);

    // Fetch utente assesgnato
    useEffect(() => {
        const assignedId = issueData?.assignedUserId;

        if (!assignedId) {
            setAssignedUser(null);
            return;
        }

        const fetchAssignedUser = async () => {
            setIsUserLoading(true);
            setUserError(null);

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`http://localhost:8080/api/users/${assignedId}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });

                if (!response.ok) {
                    throw new Error("Errore recupero utente");
                }

                const data = await response.json();
                setAssignedUser(data);
            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                setUserError("Impossibile connettersi al server");
            } finally {
                setIsUserLoading(false);
            }
        };

        fetchAssignedUser();
    }, [issueData?.assignedUserId]);

    // DOMINIO STATO ISSUE

    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [isStatusSuccess, setIsStatusSuccess] = useState(false);

    const [allStatuses, setAllStatuses] = useState([]);
    const [selectedNextStatus, setSelectedNextStatus] = useState("");

    // Fetch degli stati dal backend
    const fetchStatuses = useCallback(async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch("http://localhost:8080/api/issues/status", {
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                setAllStatuses(data);
            }
        } catch (error) {
            console.error("Errore nel recupero degli stati:", error);
        }
    }, []);

    useEffect(() => {
        if (showStatusPopup) {
            fetchStatuses();
        }
    }, [showStatusPopup, fetchStatuses]);

    // Seleziona solo gli stati settable, escludendo quello attuale
    const availableStatuses = allStatuses.filter(status =>
        status.settable && status.name !== issueData?.status?.name
    );

    // Selezionato in automatico il primo
    useEffect(() => {
        if (availableStatuses.length > 0) {
            setSelectedNextStatus(availableStatuses[0].name);
        }
    }, [allStatuses, issueData?.status?.name]);

    const handleStatusIssue = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/issues/status`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({issueId: issueData?.id, newStatus: selectedNextStatus}),
            });

            if (response.ok) {
                setIsStatusSuccess(true)
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }

        } catch (err) {
            console.error("Errore:", err);
        }
    };

    // DOMINIO CHIUSURA ISSUE

    const [showClosePopup, setShowClosePopup] = useState(false);
    const [isClosedSuccess, setIsClosedSuccess] = useState(false);

    const handleCloseIssue = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/issues/close`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({issueId: issueData?.id}),
            });

            if (response.ok) {
                setIsClosedSuccess(true)
            } else {
                alert("Errore durante la chiusura");
            }

        } catch (err) {
            console.error("Errore:", err);
        }
    };

    // FUNZIONI AUSILIARIE

    // todo: capire se ha senso farlo qui
    const getStatusStyle = (status) => {
        switch (status) {
            case 'TODO': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'INPROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Rotella di caricamento
    if (isIssueLoading) {
        return (
            <div className="p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-4xl mx-auto space-y-6">
                    <ReloadingBox description='Caricamento issue in corso...'></ReloadingBox>
                </div>
            </div>
        );
    }

    // Riquadro di errore visualizzazione issue
    if (issueError || !issueData) {
        return (
            <div className="p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-4xl mx-auto space-y-6">

                    <button
                        onClick={onBack}
                        className="text-blue-600 hover:underline"
                    >
                        &larr; Torna indietro
                    </button>

                    <p className="text-red-700">
                        {issueError || "Errore sconosciuto durante il caricamento"}
                    </p>
                </div>
            </div>
        );
    }

    // Controlli dei permessi
    const canAssign = userPermissions.includes('ASSIGN_ISSUE') && issueData?.status?.assignable && !issueData?.assignedUserId;
    const canChange = userId === issueData?.assignedUserId && issueData?.status?.modifiable;
    const canClose = userPermissions.includes('CLOSE_ISSUE') && issueData?.status?.closeable;

    // RENDERIZZAZIONE

    return (
        <div className="p-8 transition-colors">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Pulsante torna alla pagina precedente */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors mb-2"
                >
                    &larr; Torna indietro
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Proprietà issue */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Proprietà</h3>

                        <div className="flex flex-wrap gap-3">
                            {/* Stato */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(issueData?.status?.name)}`}>
                                {issueData?.status?.name || 'Stato non definito'}
                            </span>

                            {/* Tipo */}
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                {issueData?.type || 'Tipo non definito'}
                            </span>

                            {/* Priorità */}
                            {issueData?.priority && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                    Priorità
                                </span>
                            )}

                            {/* Utente assegnato */}
                            {issueData?.assignedUserId && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                    {isUserLoading ? (
                                        "Caricamento utente..."
                                    ) : userError ? (
                                        `Errore: ${userError}`
                                    ) : assignedUser ? (
                                        `Assegnata a: ${assignedUser.username}`
                                    ) : (
                                        "Utente non disponibile"
                                    )}
                                </span>
                            )}

                            {/* Nessun utente assegnato */}
                            {!canAssign && !issueData?.assignedUserId && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                    Nessun utente assegnato
                                </span>
                            )}
                        </div>

                        {/* Tag */}
                        {issueData?.tags && issueData.tags.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Tag size={16}/>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto w-full pr-2">
                                    {issueData.tags.map(tag => (
                                        <span key={tag} className="text-sm bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                    #{tag}
                                </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Azioni */}
                    <div className="w-full md:w-80 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Azioni</h3>

                        {/* Tasto Assegna */}
                        {canAssign && (
                            <CustomButton
                                variant="primary"
                                onClick={() => setShowAssignPopup(true)}
                            >
                                <UserPlus size={18}/>
                                Assegna Issue
                            </CustomButton>
                        )}

                        {/* Tasto Cambia stato issue */}
                        {canChange && (
                            <CustomButton
                                variant="primary"
                                onClick={() => setShowStatusPopup(true)}
                            >
                                Cambia stato
                            </CustomButton>
                        )}

                        {/* Tasto Chiudi issue */}
                        {canClose && (
                            <CustomButton
                                variant="danger"
                                onClick={() => setShowClosePopup(true)}
                            >
                                <BookmarkX size={18}/>
                                Chiudi Issue
                            </CustomButton>
                        )}

                        {/* Tasto Visualizza history */}
                        <CustomButton
                            variant="secondary"
                            onClick={() => setShowHistory(true)}
                        >
                            Visualizza History
                        </CustomButton>
                    </div>
                </div>

                {/* Dettagli issue */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dettagli Issue</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Titolo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                    Titolo
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium">
                                    {issueData?.title || "Nessun titolo"}
                                </div>
                            </div>

                            {/* Descrizione */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                    Descrizione
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 resize-none break-words">
                                     {issueData?.description || "Nessuna descrizione"}
                                </div>
                            </div>

                            {/* Allegato */}
                            <div className="pt-4 border-t border-gray-200 flex items-center justify-between dark:border-gray-700">
                                <div className="mt-4">
                                    {issueData?.image?.rawImage ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                                <Paperclip size={16} />
                                                <span>Immagine allegata:</span>
                                            </div>
                                            <div className="border rounded-lg overflow-hidden max-w-md mt-2">
                                                <img
                                                    src={`data:image/jpeg; base64, ${issueData.image.rawImage}`}
                                                    alt="Allegato issue"
                                                    className="w-full h-auto object-contain"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-5 00">
                                            <Paperclip size={16} />
                                            <span>Nessun allegato</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showHistory && (
                    <History
                        issueId={issueData?.id}
                        onClose={() => setShowHistory(false)}
                    />
                )}
            </div>

            {/* POPUP ASSEGNA ISSUE */}
            {showAssignPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4 border border-gray-200 dark:border-gray-700">

                        {isAssignSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check size={18} className="text-green-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Issue assegnata</h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">La issue è stata assegnata con successo all'utente</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            setShowAssignPopup(false);
                                            setIsAssignSuccess(false);
                                            setSelectedUser(null);
                                            setSearchQuery("");
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors"
                                    >
                                        Ok
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Schermata di assegnazione */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                        <UserPlus size={18} className="text-blue-700" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark: text-white">Assegna Issue</h2>
                                </div>

                                {/* Barra di ricerca */}
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cerca utente..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Lista utenti */}

                                {usersError && <p className="text-sm text-red-600">{usersError}</p>}

                                <div className="max-h-56 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
                                    {isListUsersLoading ? (
                                        <ReloadingBox description='Ricerca utenti in corso...'></ReloadingBox>
                                    ) : (
                                        <div>
                                            {filteredUsers.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-6">Nessun utente trovato</p>
                                            ) : (
                                                filteredUsers.map(user => (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                                            selectedUser?.id === user.id
                                                                ? 'bg-blue-50 dark:bg-blue-900/30'
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-semibold">
                                                            {user.username?.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.username}</p>
                                                            <p className="text-xs text-gray-400">{user.role}</p>
                                                        </div>
                                                        {selectedUser?.id === user.id && (
                                                            <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}


                                </div>

                                {/* Utente selezionato */}
                                {selectedUser && (
                                    <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                        Selezionato: <span className="font-semibold">{selectedUser.username}</span>
                                    </p>
                                )}

                                {/* Riquadro di conferma */}
                                <div className="flex justify-end gap-3 pt-1">
                                    <CustomButton
                                        variant="secondary"
                                        onClick={() => { setShowAssignPopup(false); setSelectedUser(null); setSearchQuery(""); }}
                                    >
                                        Annulla
                                    </CustomButton>
                                    <CustomButton
                                        variant="primary"
                                        onClick={handleAssignConfirm}
                                        disabled={!selectedUser}
                                    >
                                        Assegna
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


            {/* POPUP CAMBIA STATO ISSUE */}
            {showStatusPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4 border border-gray-200 dark:border-gray-700">
                        {isStatusSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Check size={18} className="text-green-600 dark:text-green-400"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stato issue modificato</h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Lo stato della issue è stato modificato con successo</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            setShowStatusPopup(false);
                                            setIsStatusSuccess(false);
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors"
                                    >
                                        Ok
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Schermata di cambio stato */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Info size={18} className="text-blue-600 dark:text-blue-400"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cambia stato Issue</h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Seleziona lo stato in cui cambiare la issue: </p>

                                <div className="mt-3 mb-1">
                                    <select
                                        value={selectedNextStatus}
                                        onChange={(e) => setSelectedNextStatus(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                                    >
                                        {availableStatuses.map((status) => (
                                            <option key={status.name} value={status.name}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 pt-1">
                                    <CustomButton
                                        variant="secondary"
                                        onClick={() => {
                                            setShowStatusPopup(false);
                                            if (availableStatuses.length > 0) {
                                                setSelectedNextStatus(availableStatuses[0].name);
                                            }
                                        }}
                                    >
                                        Annulla
                                    </CustomButton>
                                    <CustomButton
                                        variant="primary"
                                        onClick={handleStatusIssue}
                                        disabled={!selectedNextStatus}
                                    >
                                        Conferma
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* POPUP CHIUDI ISSUE */}
            {showClosePopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4 border border-gray-200 dark:border-gray-700">
                        {isClosedSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Check size={18} className="text-green-600 dark:text-green-400"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Issue chiusa</h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">La issue è stata chiusa con successo</p>
                                <div className="flex justify-end gap-3 pt-1">
                                    <CustomButton
                                        variant="secondary"
                                        onClick={() => {
                                            setShowClosePopup(false);
                                            setIsClosedSuccess(false);
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors"
                                    >
                                        Ok
                                    </CustomButton>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Schermata di chiusura issue */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <AlertCircle size={18} className="text-red-600 dark:text-red-400"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chiudi Issue</h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Sei sicuro di voler chiudere questa issue? Lo stato cambierà in "<strong>CLOSED</strong>"</p>
                                <div className="flex justify-end gap-3 pt-1">
                                    <CustomButton
                                        variant="secondary"
                                        onClick={() => setShowClosePopup(false)}
                                    >
                                        Annulla
                                    </CustomButton>
                                    <CustomButton
                                        variant="danger"
                                        onClick={handleCloseIssue}
                                    >
                                        Conferma
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewSingleIssue;