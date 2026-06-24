import React, {useEffect, useState} from "react";
import { Paperclip, X, Tag, Plus } from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";

function CreateIssue({onCancel, onIssueCreated}){
    const [selectedTags, setSelectedTags] = useState([]);
    const [attachment, setAttachment] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(false);
    const [type, setType] = useState('');
    const [availableTypes, setAvailableTypes] = useState([]);

    // Fetch types
    useEffect(() => {
        const fetchTypes = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/types`, {
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
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tags`, {
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

    const [inputTagValue, setInputTagValue] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdIssueId, setCreatedIssueId] = useState(null);

    // GESTIONE

    // Funzione per modificare le STRINGHE in Stringhe
    const formatLabel = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Ricerca tag tramite sottostringa
    const filteredTags = availableTags.filter(tag =>
        tag.toLowerCase().includes(inputTagValue.toLowerCase())
    );

    // Verifica esistenza tag
    const existTag = availableTags.some(
        (tag) => tag.toLowerCase() === inputTagValue.trim().toLowerCase()
    );

    // Aggiunge o rimuove un tag dalla lista selezionata
    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Crea un nuovo tag e lo aggiunge alla lista selezionata
    const handleAddTag = async () => {
        const tag = inputTagValue.trim();
        if (!tag || existTag) {
            setInputTagValue('');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({name: tag})
            });

            if (response.ok) {
                setAvailableTags([...availableTags, tag]);
                setSelectedTags([...selectedTags, tag]);
                setInputTagValue('');
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            alert('Errore: ' + error.message);
        }
    };

    // Gestisce l'aggiunta del file
    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (file.type.startsWith('image/')) {
                setAttachment([file]);
            } else {
                alert("File caricato non valido. Carica solo file di tipo immagine (JPG, PNG, etc...)");
            }

            e.target.value = '';
        }
    };

    // Gestione invio modulo
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formData = new FormData();

        const requestData = {
            title: title,
            description: description,
            type: type,
            priority: priority,
            tags: selectedTags
        };

        formData.append("data", new Blob([JSON.stringify(requestData)], {
            type: "application/json"
        }));

        if (attachment && attachment.length > 0) {
            formData.append("file", attachment[0]);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if(response.ok){
                const issueData = await response.json();

                setCreatedIssueId(issueData.id);
                setShowSuccess(true);

                setTitle('');
                setType('');
                setDescription('');
                setAttachment([]);
                setPriority(false);
                setSelectedTags([]);
            }else{
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }

        }catch (error){
            console.error("Errore nella chiamata al backend:", error);
            alert('Errore: ' + error.message);
        }
    };

    return (
        <div>
            {/* FORM */}
            <div className="max-w-4xl mx-auto transition-colors duration-300">
                {/* Intestazione */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Segnala Issue</h2>
                    <p className="text-gray-600 dark:text-gray-400">Compila i campi e invia il modulo</p>
                </div>

                {/* Card del Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Titolo */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Titolo
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 shadow-sm"
                                    placeholder="Inserisci il titolo della issue"
                                    required
                                />
                            </div>

                            {/* Tipo */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                                    required
                                >
                                    <option value="" disabled hidden>Seleziona tipo</option>
                                    {availableTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {formatLabel(type)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm">
                            {/* Descrizione */}
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300  mb-2">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                placeholder="Descrivi il problema o la richiesta in dettaglio..."
                                required
                            />

                            {/* Allega file */}
                            <label className="block text-sm pt-3 font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Allega immagine
                            </label>
                            {attachment.length < 1 && (
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Paperclip className="size-6 text-gray-400 dark:text-gray-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-500">Clicca per caricare un'immagine</span>
                                    <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WebP</span>
                                </label>
                            </div>
                            )}

                            {/* Allegato selezionato */}
                            {attachment.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Paperclip className="size-6 text-gray-400 dark:text-gray-500 mb-2 " />
                                            <span className="text-sm text-gray-700">Immagine allegata: {attachment[0].name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            onClick={() => setAttachment([])}
                                        >
                                            <X size={16}/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Sezione tag */}
                            <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tag</label>

                                {/* Input per la ricerca/creazione dei tag */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={inputTagValue}
                                        onChange={(e) => setInputTagValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (inputTagValue.trim() && !existTag) {
                                                    handleAddTag();
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                                        placeholder="Cerca o crea un tag..."
                                    />
                                </div>

                                {/* Risultati e creazione tag */}
                                <div className="flex flex-wrap max-h-24 overflow-y-auto gap-2 items-start pr-2">
                                    {/* Pulsante Crea (appare solo se il tag non esiste) */}
                                    {inputTagValue.trim() !== '' && !existTag && (
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                                        >
                                            <Plus size={16}/>
                                            Crea "{inputTagValue.trim()}"
                                        </button>
                                    )}

                                    {/* Lista tag esistenti filtrati */}
                                    {filteredTags.length > 0 && (
                                        filteredTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleTagToggle(tag)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    selectedTags.includes(tag)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                            <span className="flex items-center gap-2">
                                                <Tag size={14}/>
                                                {tag}
                                            </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Priorità */}
                            <div className="w-full md:w-25 h-25 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Priorità
                                    </label>
                                </div>

                                {/* Switch button todo: rivedere il funzionamento! */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={priority}
                                        onChange={(e) => setPriority(e.target.checked)}
                                    />
                                    {/* Switch sovrapposto */}
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer
                                        peer-focus:outline-none
                                        peer-checked:bg-yellow-300
                                        peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                        after:bg-white after:border-gray-300 after:border after:rounded-full
                                        after:h-5 after:w-5 after:transition-all">
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Riquadro di conferma */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <CustomButton
                                variant="secondary"
                                onClick={onCancel}
                            >
                                Annulla
                            </CustomButton>

                            <CustomButton
                                variant="primary"
                                type="submit"
                            >
                                Conferma
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>

            {/* POPUP DI SUCCESSO CREAZIONE */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-sm mx-4 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                        {/* Pulsante X di chiusura popup */}
                        <CustomButton
                            variant="secondary"
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-4 right-4"
                        >
                            <X size={20}/>
                        </CustomButton>

                        {/* Icona Successo */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Testo */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-gray-900">Issue Inviata!</h2>
                            <p className="text-sm text-gray-600">
                                La segnalazione è stata salvata correttamente nel sistema.
                            </p>
                        </div>

                        {/* Pulsante per andare alla issue */}
                        <div className="pt-2">
                            <CustomButton
                                variant="success"
                                onClick={() => onIssueCreated(createdIssueId)}
                            >
                                Vai alla issue
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateIssue;