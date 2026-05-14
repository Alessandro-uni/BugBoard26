import {useEffect, useState} from "react";
import { Paperclip, X, Tag, Plus } from 'lucide-react';

function CreateIssue({onCancel}){
    const [selectedTags, setSelectedTags] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/api/tags', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dati: ", data);

                    setAvailableTags(data.map(tag => tag.name));
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

    const [newTag, setNewTag] = useState('');
    const [showSuccess, setShowSucces] = useState(false);


    //GESTIONE

    // Aggiunge o rimuove un tag dalla lista selezionata
    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleAddTag = async () => {
        const trimmed = newTag.trim();
        if (!trimmed || availableTags.includes(trimmed)) {
            setNewTag('');
        } else {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/api/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({name: trimmed})
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Tag creato con successo:", data);

                    setAvailableTags([...availableTags, trimmed]);
                    setSelectedTags([...selectedTags, trimmed]);
                    setNewTag('');
                } else {
                    const errorJson = await response.json();
                    alert("Errore: " + errorJson.message);
                }

            } catch (error){
                console.error("Errore nella chiamata al backend:", error);
                alert('Errore: ' + error.message);
            }
        }
    };

    // Gestisce l'aggiunta dei nomi dei file
    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files) {
            // Trasforma la FileList in un array e prende solo i nomi
            const newAttachments = Array.from(files).map(file => file.name);
            setAttachments([...attachments, ...newAttachments]);
        }
    };

    // Rimuove un allegato specifico tramite indice
    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    // Gestione invio modulo
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const priorityBoolean = priority === 'alta';

        try {
            const response = await fetch('http://localhost:8080/api/issues',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({title: title, description: description, type: type, priority: priorityBoolean, tags: selectedTags})
            });

            if(response.ok){
                const data = await response.json();
                console.log("Issue creata con successo:", data);

                setShowSucces(true);
                setTitle('');
                setDescription('');
                setPriority('');
                setType('');

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
        <div className="p-6">
            <div className="max-w-4xl mx-auto">

                {/* Card del Form*/}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Titolo */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Titolo
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Inserisci il titolo della issue"
                                    required
                                />
                            </div>


                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    {/*todo:prelevare dal db*/}
                                    <option value="">Seleziona tipo</option>
                                    <option value="BUG">Bug</option>
                                    <option value="QUESTION">Question</option>
                                    <option value="FEATURE">Feature</option>
                                    <option value="DOCUMENTATION">Documentation</option>
                                </select>
                            </div>
                        </div>

                        {/* Descrizione */}
                        <div className="p-4 border border-b-black-300 rounded-lg">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descrivi il problema o la richiesta in dettaglio..."
                                required
                            />


                            {/* Allega File */}
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Allega
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    multiple
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Paperclip className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-700">Clicca per caricare file</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max 10MB)</span>
                                </label>
                            </div>

                            {/* Lista allegati selezionati */}
                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Paperclip className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-700">{file}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priorità
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value === 'true')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                            >
                                <option value="">Seleziona priorità</option>
                                <option value="false">Bassa</option>
                                <option value="true">Alta</option>
                            </select>
                        </div>

                        {/*todo : aggiungere barra di ricerca tag*/}

                        {/* Sezione Tag */}
                        <div className="p-4 border border-b-black-300 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Tag</label>

                            {/* Input per aggiungere nuovi tag */}
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Crea un nuovo tag..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Aggiungi
                                </button>
                            </div>

                            {/* Lista tag selezionabili */}
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
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
                    <Tag size={14} />
                    {tag}
                </span>
                                    </button>
                                ))}
                            </div>
                        </div>



                        {/* Azioni finali */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Conferma
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                </div>
            </div>


            {/*POPUP DI SUCCESSO CREAZIONE*/}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm mx-4 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                        {/* Icona Successo */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* Pulsante per chiudere */}
                        <div className="pt-2">
                            <button
                                onClick={() => setShowSucces(false)}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
                            >
                                Ottimo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


}


export default CreateIssue;