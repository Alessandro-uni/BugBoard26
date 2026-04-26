import {useState} from "react";
import { Paperclip, X, Tag } from 'lucide-react';

function CreateIssue(){


    const [selectedTags, setSelectedTags] = useState([]);
    const [attachments, setAttachments] = useState([]);


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');

    const availableTags = ['Frontend', 'Backend', 'Database', 'UI/UX', 'Performance', 'Security', 'Testing'];

    //GESTIONE

    // Aggiunge o rimuove un tag dalla lista selezionata
    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
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
    const handleSubmit = (e) => {
        e.preventDefault();

        // Qui andrebbe la chiamata fetch verso il backend
        const issueData = {
            title,
            description,
            type,
            priority,
            tags: selectedTags,
            attachments
        };

        console.log("Invio dati issue:", issueData);
        alert('Issue creata con successo!');
    };



    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">

                {/* Card d el Form*/}
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
                                    <option value="">Nessuno</option>
                                    <option value="todo"> Todo</option>
                                    <option value="bug"> Bug</option>
                                    <option value="question">Domanda</option>
                                    <option value="feature">Funzionalità</option>
                                    <option value="documentation">Documentazione</option>
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
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                            >
                                <option value="">Seleziona priorità</option>
                                <option value="bassa">Bassa</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>


                        {/* Sezione Tag */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Tag</label>
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
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


}


export default CreateIssue;