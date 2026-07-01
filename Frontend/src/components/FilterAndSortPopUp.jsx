import React, {useEffect, useState} from "react";
import {X, Filter, ArrowUpDown} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";
import {API_BASE_URL} from "../apiConfig.js";

function FilterAndSortPopUp({isOpen, onClose, onApplyFilters, currentFilters = {}, lockedFilters = {}}){
    // Stato unico per i filtri
    const [selectedFilters, setSelectedFilters] = useState({
        status: currentFilters.status?.name || "",
        type: currentFilters.type || "",
        reportingUserId: currentFilters.reportingUserId || "",
        isAssigned: currentFilters.isAssigned ?? null,
        assignedUserId: currentFilters.assignedUserId || "",
        isTagged: currentFilters.isTagged ?? null,
        tags: currentFilters.tags || [],
        priority: currentFilters.priority ?? null,
        hasImage: currentFilters.hasImage ?? null,
        startCreationDate: currentFilters.startCreationDate || "",
        endCreationDate: currentFilters.endCreationDate || "",
        startLastModifiedDate: currentFilters.startLastModifiedDate || "",
        endLastModifiedDate: currentFilters.endLastModifiedDate || "",
    });

    useEffect(() => {
        if (isOpen) {
            setSelectedFilters({
                status: currentFilters.status?.name || "",
                type: currentFilters.type || "",
                reportingUserId: currentFilters.reportingUserId || "",
                isAssigned: currentFilters.isAssigned ?? null,
                assignedUserId: currentFilters.assignedUserId || "",
                isTagged: currentFilters.isTagged ?? null,
                tags: currentFilters.tags || [],
                priority: currentFilters.priority ?? null,
                hasImage: currentFilters.hasImage ?? null,
                startCreationDate: currentFilters.startCreationDate || "",
                endCreationDate: currentFilters.endCreationDate || "",
                startLastModifiedDate: currentFilters.startLastModifiedDate || "",
                endLastModifiedDate: currentFilters.endLastModifiedDate || "",
            });
        }
    }, [isOpen, currentFilters]);

    const isReporterLocked = lockedFilters.hasOwnProperty('reportingUserId');

    const isAssignmentLocked = lockedFilters.hasOwnProperty('assignedUserId') || lockedFilters.hasOwnProperty('isAssignable') || lockedFilters.hasOwnProperty('isAssigned');

    const [sortBy, setSortBy] = useState('creationDate');
    const [order, setOrder] = useState('desc');

    const calculateSortingPolicy = (sortPolicy, orderPolicy) => {
        if (sortPolicy === 'creationDate') {
            return orderPolicy === 'asc' ? 'CREATION_DATE_ASCENDING' : 'CREATION_DATE_DESCENDING';

        } else if (sortPolicy === 'lastModifiedDate') {
            return orderPolicy === 'asc' ? 'LAST_MODIFIED_DATE_ASCENDING' : 'LAST_MODIFIED_DATE_DESCENDING';

        } else {
            return 'DEFAULT';
        }
    }

    const [availableStatuses, setAvailableStatuses] = useState([]);

    // Fetch statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/issues/statuses`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const statusesData = await response.json();
                    setAvailableStatuses(statusesData);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchStatuses();
    }, []);

    const [availableTypes, setAvailableTypes] = useState([]);

    // Fetch types
    useEffect(() => {
        const fetchTypes = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/issues/types`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const typeData = await response.json();
                    setAvailableTypes(typeData);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchTypes();
    }, []);

    const [availableTags, setAvailableTags] = useState([]);

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/tags`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const tagData = await response.json();
                    setAvailableTags(tagData.map(tag => tag.name));
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }
            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchTags();
    }, []);

    const [availableReportingUsers, setAvailableReportingUsers] = useState([]);

    // Fetch utenti che possono reportare issue
    useEffect(() => {
        const fetchReportingUsers = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/reporting`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setAvailableReportingUsers(userData);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchReportingUsers();
    }, []);

    const [availableAssignableUsers, setAvailableAssignableUsers] = useState([]);

    // Fetch utenti che possono ricevere issue
    useEffect(() => {
        const fetchAssignableUsers = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/assignable`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setAvailableAssignableUsers(userData);
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        };

        fetchAssignableUsers();
    }, []);

    // GESTIONE

    const handleChange = (e) => {
        const {id, value, type, checked, selectedOptions, name} = e.target;
        let newValue;

        if (type === 'checkbox') {
            if (id === 'tags') {
                setSelectedFilters(prev => ({
                    ...prev,
                    tags: checked
                        ? [...prev.tags, value]
                        : prev.tags.filter((t) => t !== value),
                }));
                return;
            }
            newValue = checked;

        } else if (type === 'select-multiple') {
            newValue = Array.from(selectedOptions).map(option => option.value);

        } else if (name === 'booleanField') {
            if (value === "true") newValue = true;
            else if (value === "false") newValue = false;
            else newValue = null;

        } else if (type === 'date') {
            if (value) {
                const lowerId = id.toLowerCase();

                if (lowerId.includes('end')) {
                    newValue = `${value}T23:59:59`;
                } else {
                    newValue = `${value}T00:00:00`
                }
            } else {
                newValue = "";
            }

        } else {
            newValue = value;
        }

        setSelectedFilters(prev => ({
            ...prev,
            [id]: newValue
        }));
    };

    const handleReset = () => {
        setSelectedFilters({
            status: "",
            type: "",
            reportingUserId: "",
            isAssigned: null,
            assignedUserId: "",
            isTagged: null,
            tags: [],
            priority: null,
            hasImage: null,
            startCreationDate: "",
            endCreationDate: "",
            startLastModifiedDate: "",
            endLastModifiedDate: ""
        });

        setSortBy('creationDate');
        setOrder('desc');

        onClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const myFilters = Object.fromEntries(Object.entries(selectedFilters).filter(([_, value]) => value !== "" && value !== null && value.length !== 0));
        const mySort = calculateSortingPolicy(sortBy, order);

        onApplyFilters(myFilters, mySort);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    // Funzione per modificare le STRINGHE in Stringhe
    const formatLabel = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="relative flex flex-col gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4 px-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
                {/* Header principale */}
                <div className="flex items-center justify-between pt-6 sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Filtra e ordina Issue
                    </h2>
                    <CustomButton
                        variant="secondary"
                        onClick={onClose}
                    >
                        <X size={20}/>
                    </CustomButton>
                </div>

                <form id="filterForm" onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Contenitore filtri */}
                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        {/* Header*/}
                        <div className="flex items-center justify-between mb-6 sticky top-0 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} />
                                Filtri
                            </h2>
                        </div>

                        {/* Campi di filtraggio */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Stato */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Stato
                                    </label>
                                    <select
                                        id="status"
                                        value={selectedFilters.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Nessuno stato selezionato</option>
                                        {availableStatuses.map((status) => (
                                            <option key={status.name} value={status.name}>
                                                {formatLabel(status.name)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tipo */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Tipo
                                    </label>
                                    <select
                                        id="type"
                                        value={selectedFilters.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Nessun tipo selezionato</option>
                                        {availableTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {formatLabel(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Utente segnalatore */}
                                <div>
                                    <label htmlFor="reportingUserId" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Segnalata da {isReporterLocked && " (Filtro fisso)"}
                                    </label>
                                    <select
                                        id="reportingUserId"
                                        disabled={isReporterLocked}
                                        value={selectedFilters.reportingUserId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Nessun utente selezionato</option>
                                        {availableReportingUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {formatLabel(user.username)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Utente Assegnato */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="assignedUserId" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            Assegnata a {isAssignmentLocked && " (Filtro fisso)"}
                                        </label>

                                        {/* Checkbox (utente non assegnato) */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id="noAssignedUser"
                                                disabled={isAssignmentLocked}
                                                checked={selectedFilters.isAssigned === false || lockedFilters.isAssignable === true}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setSelectedFilters(prev => ({
                                                        ...prev,
                                                        isAssigned: isChecked ? false : null,
                                                        assignedUserId: isChecked ? "" : prev.assignedUserId
                                                    }));
                                                }}
                                                className="cursor-pointer text-blue-600 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <label htmlFor="noAssignedUser" className="text-sm text-gray-600 select-none dark:text-gray-300">
                                                Senza utente
                                            </label>
                                        </div>
                                    </div>

                                    {/* Se la checkbox non è spuntata, mostrata la select */}
                                    {selectedFilters.isAssigned === false || lockedFilters.isAssignable === true ? (
                                        <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-500 italic text-sm">
                                            Nessun utente
                                        </div>
                                    ) : (
                                        <select
                                            id="assignedUserId"
                                            disabled={isAssignmentLocked}
                                            value={selectedFilters.assignedUserId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Nessun utente selezionato</option>
                                            {availableAssignableUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {formatLabel(user.username)}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                </div>

                                {/* Tag */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            Tag
                                        </label>

                                        {/* Checkbox (nessun tag assegnato) */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id="noTags"
                                                checked={selectedFilters.isTagged === false}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setSelectedFilters(prev => ({
                                                        ...prev,
                                                        isTagged: isChecked ? false : null,
                                                        tags: isChecked ? [] : prev.tags
                                                    }));
                                                }}
                                                className="cursor-pointer text-blue-600 focus:ring-blue-500 rounded"
                                            />
                                            <label htmlFor="noTags" className="text-sm text-gray-600 cursor-pointer select-none dark:text-gray-300">
                                                Senza tag
                                            </label>
                                        </div>
                                    </div>

                                    {/* Se la checkbox non è spuntata, mostrata la select */}
                                    {selectedFilters.isTagged === false ? (
                                        <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-500 italic text-sm">
                                            Nessun tag
                                        </div>
                                    ) : (
                                        <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                                            {availableTags.map((tag) => {
                                                const isSelected = selectedFilters.tags.includes(tag);
                                                return (
                                                    <label
                                                        key={tag}
                                                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-sm transition-colors ${isSelected
                                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                                            : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id="tags"
                                                            value={tag}
                                                            checked={isSelected}
                                                            onChange={handleChange}
                                                            className="accent-blue-500 w-4 h-4 cursor-pointer"
                                                        />
                                                        {formatLabel(tag)}
                                                    </label>
                                                );
                                            })}
                                        </div>

                                    )}
                                </div>

                                {/* Priorità */}
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Priorità
                                    </label>

                                    <select
                                        id="priority"
                                        name="booleanField"
                                        value={selectedFilters.priority !== null && selectedFilters.priority !== "" ? String(selectedFilters.priority) : ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Nessuna priorità selezionata</option>
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </div>

                            {/* Sezione date: Creazione */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 dark:text-gray-300">Data creazione</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startCreationDate" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            Da:
                                        </label>
                                        <input
                                            type="date"
                                            max={selectedFilters.endCreationDate ? selectedFilters.endCreationDate.split('T')[0] : undefined}
                                            id="startCreationDate"
                                            value={selectedFilters.startCreationDate ? selectedFilters.startCreationDate.split('T')[0] : ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark "
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="endCreationDate" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            A:
                                        </label>
                                        <input
                                            type="date"
                                            min={selectedFilters.startCreationDate ? selectedFilters.startCreationDate.split('T')[0] : undefined}
                                            id="endCreationDate"
                                            value={selectedFilters.endCreationDate ? selectedFilters.endCreationDate.split('T')[0] : ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sezione date: Modifica */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ultima modifica</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startLastModifiedDate" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            Da:
                                        </label>
                                        <input
                                            type="date"
                                            max={selectedFilters.endLastModifiedDate ? selectedFilters.endLastModifiedDate.split('T')[0] : undefined}
                                            id="startLastModifiedDate"
                                            value={selectedFilters.startLastModifiedDate ? selectedFilters.startLastModifiedDate.split('T')[0] : ""}
                                            onChange={handleChange}
                                            className=" w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="endLastModifiedDate" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                            A:
                                        </label>
                                        <input
                                            type="date"
                                            min={selectedFilters.startLastModifiedDate ? selectedFilters.startLastModifiedDate.split('T')[0] : undefined}
                                            id="endLastModifiedDate"
                                            value={selectedFilters.endLastModifiedDate ? selectedFilters.endLastModifiedDate.split('T')[0] : ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenitore ordinamento */}
                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 sticky top-0 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ArrowUpDown size={20} />
                                Ordinamento
                            </h2>
                        </div>

                        {/* Campi di ordinamento */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ordina per
                                    </label>
                                    <select
                                        id="sortBy"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="creationDate">Data Creazione</option>
                                        <option value="lastModifiedDate">Data Ultima modifica</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ordine
                                    </label>
                                    <select
                                        id="sortOrder"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="desc">Decrescente</option>
                                        <option value="asc">Crescente</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pulsanti */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                        <CustomButton
                            variant="secondary"
                            onClick={handleReset}
                        >
                            Annulla
                        </CustomButton>

                        <CustomButton
                            variant="primary"
                            type="submit"
                        >
                            Applica
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FilterAndSortPopUp;