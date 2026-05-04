import React, { useState } from "react";
import { Paperclip, Tag, UserPlus, X} from "lucide-react";

function ViewSingleIssue({ issueData, onAssignIssue, onBack, userRole }) {

    const [title, setTitle] = useState(issueData?.title || "");
    const [description, setDescription] = useState(issueData?.description || "");
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [showClosePopup, setShowClosePopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch utenti dal backend
    useEffect(() => {
        if (showAssignPopup) {
            fetch("http://localhost:8080/api/users")
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Errore caricamento utenti:", err));
        }
    }, [showAssignPopup]);

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignConfirm = async () => {
        if (!selectedUser) return;
        try {
            const response = await fetch(`http://localhost:8080/api/issues/${issueData?.id}/assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id }),
            });
            if (response.ok) {
                onAssignIssue(selectedUser);
                setShowAssignPopup(false);
                setSelectedUser(null);
            } else {
                alert("Errore durante l'assegnazione");
            }
        } catch (err) {
            console.error("Errore:", err);
        }
    };

    const handleCloseIssue = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/issues/${issueData?.id}/close`, {
                method: "PUT",
            });
            if (response.ok) {
                setShowClosePopup(false);
            } else {
                alert("Errore durante la chiusura");
            }
        } catch (err) {
            console.error("Errore:", err);
        }
    };

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
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setShowAssignPopup(true)}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                        >
                            <UserPlus size={18} />
                            Assegna Issue
                        </button>
                    )}

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
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                                    <Paperclip size={16} />
                                    <span>Visualizza allegati (2 file)</span>
                                </div>

                                {/* Tasto Chiudi Issue */}
                                <button
                                    onClick={() => onAssignIssue(issueData?.id)}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md active:scale-95"
                                >
                                    Chiudi Issue
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* POPUP ASSEGNA */}
            {showAssignPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">

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
                                            <Check size={16} className="text-blue-600 flex-shrink-0" />
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
                    </div>
                </div>
            )}

            {/* POPUP CHIUDI */}
            {showClosePopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                <X size={18} className="text-red-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Chiudi Issue</h2>
                        </div>
                        <p className="text-sm text-gray-600">Sei sicuro di voler chiudere questa issue? Lo stato cambierà in "Chiuso".</p>
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
                    </div>
                </div>
            )}



        </div>
    );
}

export default ViewSingleIssue;