import React, {useEffect, useState} from "react";
import {Paperclip, Tag, UserPlus, Search, Check, Info, AlertCircle} from "lucide-react";

function ViewSingleIssue({issueId, userRole, userId, onBack}) {
    // DOMINIO ISSUE

    const [issueData, setIssueData] = useState(null);
    const [isIssueLoading, setIsIssueLoading] = useState(true);
    const [issueError, setIssueError] = useState(null);

    // Fetch dettagli della issue
    const fetchIssueDetails = async () => {
        setIssueError(null);
        setIsIssueLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            setIssueError("Autenticazione assente");
            setIsIssueLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/issues/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id: issueId})
            });

            if (response.ok) {
                const data = await response.json();
                setIssueData(data && data.length > 0 ? data[0] : null);
            } else {
                const errorText = await response.text();
                let errorMessage = "Errore durante il caricamento della issue";

                try {
                    errorMessage = JSON.parse(errorText).message || errorMessage;
                } catch (e) {}

                setIssueError(errorMessage);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            setIssueError("Impossibile connettersi al server");
        } finally {
            setIsIssueLoading(false);
        }
    };

    // Caricamento iniziale dettagli della issue
    useEffect(() => {
        if (issueId) {
            fetchIssueDetails();
        }
    }, [issueId]);

    // DOMINIO UTENTI ASSEGNABILI

    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [isAssignSuccess, setIsAssignSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch utenti
    useEffect(() => {
        if (showAssignPopup) {
            const token = localStorage.getItem('token');
            fetch("http://localhost:8080/api/users/available", {
                headers: {'Authorization': `Bearer ${token}`}
            })
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Errore caricamento utenti:", err));
        }
    }, [showAssignPopup]);

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
                body: JSON.stringify({issue: {id: issueData?.id}, user: {id: selectedUser.id}}),
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

                if (!response.ok) throw new Error("Errore recupero utente");

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

    // Calcolo prossimo stato issue
    const statusTransition = {
        'TODO' : 'INPROGRESS',
        'INPROGRESS' : 'RESOLVED'
    }

    // Prossimo stato issue
    const nextStatus = statusTransition[issueData?.status] || null;

    const handleStatusIssue = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/issues/status`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id: issueData?.id, newStatus: nextStatus}),
            });

            if (response.ok) {
                setIsStatusSuccess(true)
            } else {
                alert("Errore durante il cambio di stato della issue");
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
                body: JSON.stringify({id: issueData?.id}),
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-500 font-medium animate-pulse">Caricamento dettagli issue...</div>
            </div>
        );
    }

    // Verifica esistenza della issue
    if (!issueData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500 font-medium mb-4">Impossibile trovare l'issue richiesta</p>
                <button onClick={onBack} className="text-blue-600 hover:underline">&larr; Torna indietro</button>
            </div>
        );
    }

    // Controlli dei permessi
    const canAssign = userRole === 'ADMIN' && issueData.status !== "CLOSED" && !issueData?.assignedUserId;
    const canChange = userId === issueData?.assignedUserId && issueData?.status !== 'CLOSED' && issueData?.status !== 'RESOLVED';
    const canClose = userRole === 'ADMIN' && issueData?.status !== 'CLOSED';

    // RENDERIZZAZIONE

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Pagina di errore visualizzazione issue */}
                {issueError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700">{issueError}</p>
                    </div>
                )}

                {/* Pulsante torna alla pagina precedente */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors mb-2"
                >
                    <span className="text-xl leading-none">&larr;</span> Torna indietro
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Proprietà issue */}
                    <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Proprietà</h3>

                        <div className="flex flex-wrap gap-3">
                            {/* Stato */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(issueData?.status)}`}>
                                {issueData?.status || 'Stato non definito'}
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
                            {!(userRole === 'ADMIN' && issueData.status !== "CLOSED") && !issueData?.assignedUserId && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                    Nessun utente assegnato
                                </span>
                            )}
                        </div>

                        {/* Tag */}
                        {issueData?.tags && issueData.tags.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Tag size={16}/>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto w-full pr-2">
                                    {issueData.tags.map(tag => (
                                        <span key={tag} className="text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                    #{tag}
                                </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Azioni */}
                    {(canAssign || canChange || canClose) && (
                        <div className="w-full md:w-80 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Azioni</h3>

                            {/* Tasto Assegna */}
                            {canAssign && (
                                <button
                                    onClick={() => setShowAssignPopup(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                                >
                                    <UserPlus size={18} />
                                    Assegna Issue
                                </button>
                            )}

                            {/* Tasto Cambia stato issue */}
                            {canChange && (
                                <button
                                    onClick={() => setShowStatusPopup(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                                >
                                    Cambia stato in {nextStatus}
                                </button>
                            )}

                            {/* Tasto Chiudi Issue */}
                            {canClose    && (
                                <button
                                    onClick={() => setShowClosePopup(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                                >
                                    Chiudi Issue
                                </button>
                            )}

                        </div>
                    )}
                </div>

                {/* Dettagli issue */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-900">Dettagli Issue</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Titolo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                    Titolo
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium">
                                    {issueData?.title || "Nessun titolo"}
                                </div>
                            </div>

                            {/* Descrizione */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                    Descrizione
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 resize-none wrap-break-word">
                                     {issueData?.description || "Nessuna descrizione"}
                                </div>
                            </div>

                            {/* Allegato */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
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
                                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                                            <Paperclip size={16} />
                                            <span>Nessun allegato</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* POPUP ASSEGNA ISSUE */}
            {showAssignPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">

                        {isAssignSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check size={18} className="text-green-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Issue assegnata</h2>
                                </div>
                                <p className="text-sm text-gray-600">La issue è stata assegnata con successo all'utente</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            setShowAssignPopup(false);
                                            setIsAssignSuccess(false);
                                            setSelectedUser(null);
                                            setSearchQuery("");
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
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
                                    <h2 className="text-lg font-bold text-gray-900">Assegna Issue</h2>
                                </div>

                                {/* Barra di ricerca */}
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cerca utente..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Lista utenti */}
                                <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                                    {filteredUsers.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-6">Nessun utente trovato</p>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                                    selectedUser?.id === user.id
                                                        ? 'bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                                                    {user.username?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800">{user.username}</p>
                                                    <p className="text-xs text-gray-400">{user.role}</p>
                                                </div>
                                                {selectedUser?.id === user.id && (
                                                    <Check size={16} className="text-blue-600 shrink-0" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Utente selezionato */}
                                {selectedUser && (
                                    <p className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                                        Selezionato: <span className="font-semibold">{selectedUser.username}</span>
                                    </p>
                                )}

                                {/* Riquadro di conferma */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => { setShowAssignPopup(false); setSelectedUser(null); setSearchQuery(""); }}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleAssignConfirm}
                                        disabled={!selectedUser}
                                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Assegna
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


            {/* POPUP CAMBIA STATO ISSUE */}
            {showStatusPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
                        {isStatusSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check size={18} className="text-green-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Stato issue modificato</h2>
                                </div>
                                <p className="text-sm text-gray-600">Lo stato della issue è stato modificato con successo</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            setShowStatusPopup(false);
                                            setIsStatusSuccess(false);
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
                                    >
                                        Ok
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Schermata di cambio stato */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Info size={18} className="text-blue-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Cambia stato Issue</h2>
                                </div>
                                <p className="text-sm text-gray-600">Clicca il pulsante di conferma per cambiare lo stato in "<strong>{nextStatus}</strong>"</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => setShowStatusPopup(false)}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleStatusIssue}
                                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                                    >
                                        Conferma
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* POPUP CHIUDI ISSUE */}
            {showClosePopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
                        {isClosedSuccess ? (
                            <>
                                {/* Schermata di successo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                        <Check size={18} className="text-green-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Issue chiusa</h2>
                                </div>
                                <p className="text-sm text-gray-600">La issue è stata chiusa con successo</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            setShowClosePopup(false);
                                            setIsClosedSuccess(false);
                                            fetchIssueDetails();
                                        }}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
                                    >
                                        Ok
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Schermata di chiusura issue */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertCircle size={18} className="text-red-600"/>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Chiudi Issue</h2>
                                </div>
                                <p className="text-sm text-gray-600">Sei sicuro di voler chiudere questa issue? Lo stato cambierà in "<strong>CLOSED</strong>"</p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => setShowClosePopup(false)}
                                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleCloseIssue}
                                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                                    >
                                        Conferma
                                    </button>
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