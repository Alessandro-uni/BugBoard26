import React, {useEffect, useState} from "react";
import {X, Filter, ArrowUpDown} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";
import {API_BASE_URL} from "../apiConfig.js";
import {ReloadingBox} from "./ReloadingBox.jsx";

// Funzioni di supporto

const getDefaultFilters = (filters) => ({
    status: filters.status?.name || "",
    type: filters.type || "",
    reportingUserId: filters.reportingUserId || "",
    isAssigned: filters.isAssigned ?? null,
    assignedUserId: filters.assignedUserId || "",
    isTagged: filters.isTagged ?? null,
    tags: filters.tags || [],
    priority: filters.priority ?? null,
    hasImage: filters.hasImage ?? null,
    startCreationDate: filters.startCreationDate || "",
    endCreationDate: filters.endCreationDate || "",
    startLastModifiedDate: filters.startLastModifiedDate || "",
    endLastModifiedDate: filters.endLastModifiedDate || "",
});

const getInputValue = (target) => {
    const {id, value, type, checked, selectedOptions, name} = target;

    // Gestione campi booleani
    if (name === 'booleanField') {
        if (value === "true") return true;
        else if (value === "false") return false;
        else return null;
    }

    // Gestione campi input
    switch (type) {
        case 'select-multiple':
            return Array.from(selectedOptions).map(option => option.value);

        case 'checkbox':
            return checked;

        case 'date':
            if (value) {
                const lowerId = id.toLowerCase();

                if (lowerId.includes('end')) {
                    return `${value}T23:59:59`;
                } else {
                    return `${value}T00:00:00`
                }
            } else {
                return "";
            }

        default:
            return value;
    }
};

// Componente lista stati
const FilterStatuses = ({availableStatuses, selectedValue, handleChange, formatLabel}) => (
    <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            Stato
        </label>
        <select
            id="status"
            value={selectedValue}
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
);

// Componente lista tipi
const FilterTypes = ({availableTypes, selectedValue, handleChange, formatLabel}) => (
    <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            Tipo
        </label>
        <select
            id="type"
            value={selectedValue}
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
);

// Componente lista utenti segnalatori
const FilterReportingUsers = ({availableReportingUsers, selectedValue, isReporterLocked, handleChange, formatLabel}) => (
    <div>
        <label htmlFor="reportingUserId" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            Segnalata da {isReporterLocked && " (Filtro fisso)"}
        </label>
        <select
            id="reportingUserId"
            disabled={isReporterLocked}
            value={selectedValue}
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
);

// Componente lista utenti assegnabili
const FilterAssignableUsers = ({availableAssignableUsers, selectedFilters, setSelectedFilters, isAssignmentLocked, isAssignable, handleChange, formatLabel}) => {
    const {isAssigned, assignedUserId} = selectedFilters;

    return (
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
                        checked={isAssigned === false || isAssignable === true}
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
            {isAssigned === false || isAssignable === true ? (
                <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-500 italic text-sm">
                    Nessun utente
                </div>
            ) : (
                <select
                    id="assignedUserId"
                    disabled={isAssignmentLocked}
                    value={assignedUserId}
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
    )
};

// Componente lista tag
const FilterTags = ({availableTags, selectedFilters, setSelectedFilters, handleChange, formatLabel}) => {
    const {isTagged, tags} = selectedFilters;

    return (
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
                        checked={isTagged === false}
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
            {isTagged === false ? (
                <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-500 italic text-sm">
                    Nessun tag
                </div>
            ) : (
                <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                    {availableTags.map((tag) => {
                        const isSelected = tags.includes(tag);
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
    );
};

// Componente lista priorità
const FilterPriorities = ({selectedValue, handleChange}) => (
    <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            Priorità
        </label>

        <select
            id="priority"
            name="booleanField"
            value={selectedValue !== null && selectedValue !== "" ? String(selectedValue) : ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
            <option value="">Nessuna priorità selezionata</option>
            <option value="true">Si</option>
            <option value="false">No</option>
        </select>
    </div>
);

// Componente lista date
const FilterDates = ({title, startId, endId, selectedStartValue, selectedEndValue, handleChange}) => (
    <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 dark:text-gray-300">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor={startId} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Da:
                </label>
                <input
                    type="date"
                    max={selectedEndValue ? selectedEndValue.split('T')[0] : undefined}
                    id={startId}
                    value={selectedStartValue ? selectedStartValue.split('T')[0] : ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark "
                />
            </div>
            <div>
                <label htmlFor={endId} className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    A:
                </label>
                <input
                    type="date"
                    min={selectedStartValue ? selectedStartValue.split('T')[0] : undefined}
                    id={endId}
                    value={selectedEndValue ? selectedEndValue.split('T')[0] : ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white scheme-light dark:scheme-dark"
                />
            </div>
        </div>
    </div>
);

// Funzione principale
function FilterAndSortPopUp({isOpen, onClose, onApplyFilters, currentFilters = {}, lockedFilters = {}}){
    // Sorting
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
    };

    // Filtering

    // Stato unico per i filtri
    const [selectedFilters, setSelectedFilters] = useState(() => getDefaultFilters(currentFilters));
    const [isFilterListLoading, setIsFilterListLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedFilters(getDefaultFilters(currentFilters));
        }
    }, [isOpen, currentFilters]);

    // Filtri bloccati
    const isReporterLocked = lockedFilters.hasOwnProperty('reportingUserId');
    const isAssignmentLocked = lockedFilters.hasOwnProperty('assignedUserId') || lockedFilters.hasOwnProperty('isAssignable') || lockedFilters.hasOwnProperty('isAssigned');

    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableReportingUsers, setAvailableReportingUsers] = useState([]);
    const [availableAssignableUsers, setAvailableAssignableUsers] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    // Fetch all filters
    useEffect(() => {
        const fetchFilters = async (endpoint) => {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorJson = await response.json();
                throw new Error(errorJson.message || "Errore nel caricamento dei tipi e/o tags");
            }

            return await response.json();
        };

        const fetchAllData = async () => {
            setIsFilterListLoading(true);

            try {
                const [statusesData, typesData, availableReportingUsersData, availableAssignableUsersData, tagsData] = await Promise.all([
                    fetchFilters('/api/issues/statuses'),
                    fetchFilters('/api/issues/types'),
                    fetchFilters('/api/users/reporting'),
                    fetchFilters('/api/users/assignable'),
                    fetchFilters('/api/tags')
                ]);

                setAvailableStatuses(statusesData);
                setAvailableTypes(typesData);
                setAvailableReportingUsers(availableReportingUsersData);
                setAvailableAssignableUsers(availableAssignableUsersData);
                setAvailableTags(tagsData.map(tag => tag.name));
            } catch (error) {
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            } finally {
                setIsFilterListLoading(false);
            }
        };

        void fetchAllData();
    }, []);

    // GESTIONE

    const handleChange = (e) => {
        const {id, value, type, checked} = e.target;

        if (type === 'checkbox' && id === 'tags') {
            setSelectedFilters(prev => ({
                ...prev,
                tags: checked
                    ? [...prev.tags, value]
                    : prev.tags.filter((t) => t !== value),
            }));
            return;
        }

        const newValue = getInputValue(e.target);

        setSelectedFilters(prev => ({
            ...prev,
            [id]: newValue
        }));
    };

    const handleReset = () => {
        setSelectedFilters(getDefaultFilters());

        setSortBy('creationDate');
        setOrder('desc');

        onClose();
    };

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

    // Funzione per la formattazione delle stringe (in Stringhe)
    const formatLabel = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">

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
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 sticky top-0 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} />
                                Filtri
                            </h2>
                        </div>

                        {isFilterListLoading ? (
                            <ReloadingBox description='Caricamento filtri in corso...'></ReloadingBox>
                        ) : (
                            // Campi di filtraggio
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Stato */}
                                    <FilterStatuses
                                        availableStatuses={availableStatuses}
                                        selectedValue={selectedFilters.status}
                                        handleChange={handleChange}
                                        formatLabel={formatLabel}
                                    />

                                    {/* Tipo */}
                                    <FilterTypes
                                        availableTypes={availableTypes}
                                        selectedValue={selectedFilters.type}
                                        handleChange={handleChange}
                                        formatLabel={formatLabel}
                                    />

                                    {/* Utente segnalatore */}
                                    <FilterReportingUsers
                                        availableReportingUsers={availableReportingUsers}
                                        selectedValue={selectedFilters.type}
                                        isReporterLocked={isReporterLocked}
                                        handleChange={handleChange}
                                        formatLabel={formatLabel}
                                    />

                                    {/* Utente assegnato */}
                                    <FilterAssignableUsers
                                        availableAssignableUsers={availableAssignableUsers}
                                        selectedFilters={selectedFilters}
                                        setSelectedFilters={setSelectedFilters}
                                        isAssignmentLocked={isAssignmentLocked}
                                        handleChange={handleChange}
                                        formatLabel={formatLabel}
                                        isAssignable={lockedFilters.isAssignable}
                                    />

                                    {/* Tag */}
                                    <FilterTags
                                        availableTags={availableTags}
                                        selectedFilters={selectedFilters}
                                        setSelectedFilters={setSelectedFilters}
                                        handleChange={handleChange}
                                        formatLabel={formatLabel}
                                    />

                                    {/* Priorità */}
                                    <FilterPriorities
                                        selectedValue={selectedFilters.priority}
                                        handleChange={handleChange}
                                    />
                                </div>

                                {/* Sezione date: Creazione */}
                                <FilterDates
                                    title="Data creazione"
                                    startId="startCreationDate"
                                    endId="endCreationDate"
                                    selectedStartValue={selectedFilters.startCreationDate}
                                    selectedEndValue={selectedFilters.endCreationDate}
                                    handleChange={handleChange}
                                />

                                {/* Sezione date: Modifica */}
                                <FilterDates
                                    title="Ultima modifica"
                                    startId="startLastModifiedDate"
                                    endId="endLastModifiedDate"
                                    selectedStartValue={selectedFilters.startLastModifiedDate}
                                    selectedEndValue={selectedFilters.endLastModifiedDate}
                                    handleChange={handleChange}
                                />
                            </div>

                        )}
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